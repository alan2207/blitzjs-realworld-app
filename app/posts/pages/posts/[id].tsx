import React from "react"
import MainLayout from "app/layouts/MainLayout"
import {
  useQuery,
  useRouter,
  useSession,
  Link,
  useParams,
  ssrQuery,
  GetServerSideProps,
  PromiseReturnType,
} from "blitz"
import getPost from "app/posts/queries/getPost"
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
} from "@chakra-ui/core"
import { cardStyles } from "app/styles"
import MarkdownPreview from "app/components/MarkdownPreview"
import Form from "app/components/Form"
import createComment from "app/comments/mutations/createComment"
import formatDate from "app/utils/formatDate"

type PageProps = {
  postData: PromiseReturnType<typeof getPost>
}

const PostPage = ({ postData }) => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const session = useSession()
  const router = useRouter()
  const params = useParams("number")
  const [post, { refetch }] = useQuery(
    getPost,
    {
      where: {
        id: params?.id,
      },
      include: {
        User: true,
        comments: {
          include: {
            user: true,
          },
        },
        tags: true,
      },
    },
    {
      initialData: postData,
    }
  )

  return (
    <MainLayout headTitle={post.title}>
      <Box {...cardStyles(colorMode)} maxW="containers.lg" mx="auto" my="4" p="8">
        <Heading textAlign="center">{post.title}</Heading>

        <Flex justify="space-between" align="center" my="8">
          <Box>
            <Text>Created By: {post.User?.name}</Text>
            <Text>Date: {formatDate(post.createdAt)}</Text>
          </Box>

          {session.userId === post.userId && (
            <Button onClick={() => router.push(`/posts/${params.id}/edit`)}>Edit</Button>
          )}
        </Flex>
        <MarkdownPreview content={post?.content || ""} />
        <Flex my="1">
          {post?.tags.map((t) => (
            <Link key={t.name} href={`/tags/${t.name}`}>
              <Button mr="2" size="sm">
                #{t.name}
              </Button>
            </Link>
          ))}
        </Flex>
      </Box>

      <Box {...cardStyles(colorMode)} maxW="containers.lg" mx="auto" my="4" p="8">
        <Heading>Comments</Heading>
        {session.userId && (
          <Button my="4" bg="bg-dark" color="text-light" onClick={onOpen}>
            Write Comment
          </Button>
        )}
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose()
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Form
                onSubmit={async ({ values: { tags, ...values }, formControls: { reset } }) => {
                  await createComment({
                    data: {
                      ...values,
                      post: {
                        connect: {
                          id: params.id,
                        },
                      },
                      user: {
                        connect: {
                          id: session?.userId,
                        },
                      },
                    },
                  })
                  reset()
                  refetch()
                  onClose()
                }}
                defaultValues={{ content: "" }}
                fields={{
                  content: {
                    name: "content",
                    label: "Content",
                    type: "markdown",
                    validation: { required: true },
                  },
                }}
              />
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>

        {post.comments.map((c) => (
          <Box key={c.id} {...cardStyles(colorMode)} my="4">
            <Box>
              <Link href={`/users/${c.user.id}`}>{c.user.name || ""}</Link>
              <Text mb="2" color="gray.500" fontSize="xs">
                {formatDate(c.createdAt)}
              </Text>
              <Box>
                <MarkdownPreview content={c.content} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, res, params }) => {
  const post = await ssrQuery(
    getPost,
    {
      where: {
        //@ts-ignore
        id: +params?.id,
      },
      include: {
        User: true,
        comments: {
          include: {
            user: true,
          },
        },
        tags: true,
      },
    },
    { req, res }
  )

  return {
    props: { postData: JSON.parse(JSON.stringify(post)) },
  }
}

export default PostPage
