import React from "react"
import MainLayout from "app/layouts/MainLayout"
import {
  ssrQuery,
  GetServerSideProps,
  PromiseReturnType,
  Head,
  useQuery,
  useRouter,
  useSession,
  Link,
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
} from "@chakra-ui/core"
import { cardStyles } from "app/styles"
import MarkdownPreview from "app/components/MarkdownPreview"
import Form from "app/components/Form"
import createComment from "app/comments/mutations/createComment"

type PageProps = {
  postData: PromiseReturnType<typeof getPost>
}

const PostPage = ({ postData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const session = useSession()
  const router = useRouter()
  const [post, { refetch }] = useQuery(
    getPost,
    {
      where: {
        id: +router.params.id,
      },
      include: {
        User: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    },
    {
      initialData: postData,
    }
  )

  return (
    <MainLayout>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box {...cardStyles} maxW="containers.lg" minH="80vh" mx="auto" my="4" p="4">
        <Heading textAlign="center">{post.title}</Heading>
        <Flex>
          <Box p="8">
            <Text>Created By: {post.User?.name}</Text>
            <Text>Date: {post.createdAt}</Text>
          </Box>
        </Flex>
        <MarkdownPreview content={post.content} />
      </Box>

      <Box {...cardStyles} maxW="containers.lg" mx="auto" my="4" p="8">
        <Heading>Comments</Heading>
        <Button my="4" bg="bg-dark" color="text-light" onClick={onOpen}>
          Write Comment
        </Button>
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
                          id: +router.params.id,
                        },
                      },
                      user: {
                        connect: {
                          id: +session?.userId,
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
          <Box p="4" bg="gray.100" my="4">
            <Box>
              <Link href={`/users/${c.user.id}`}>{c.user.name || ""}</Link>
              <Text mb="2" color="gray.500" fontSize="xs">
                {c.createdAt}
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
        id: +params.id,
      },
      include: {
        User: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    },
    { req, res }
  )

  return {
    props: { postData: JSON.parse(JSON.stringify(post)) },
  }
}

export default PostPage
