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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/core"
import { useElementStyles } from "app/styles"
import MarkdownPreview from "app/components/MarkdownPreview"
import Form from "app/components/Form"
import createComment from "app/comments/mutations/createComment"
import formatDate from "app/utils/formatDate"
import deletePost from "app/posts/mutations/deletePost"

type PageProps = {
  postData: PromiseReturnType<typeof getPost>
}

const PostPage = ({ postData }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const onModalClose = () => setIsModalOpen(false)
  const cancelRef = React.useRef()
  const { cardStyles } = useElementStyles()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const session = useSession()
  const router = useRouter()
  const params = useParams("string")
  const [post, { refetch }] = useQuery(
    getPost,
    {
      where: {
        id: params?.id,
      },
      include: {
        user: true,
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
      <Box {...cardStyles} maxW="containers.lg" mx="auto" my="4" p="8">
        <Heading textAlign="center">{post.title}</Heading>

        <Flex justify="space-between" align="center" my="8">
          <Box>
            <Link href="/users/[userId]" as={`/users/${post.userId}`}>
              {post.user?.name || "User"}
            </Link>
            <Text mb="2" color="gray.500" fontSize="xs">
              {formatDate(post.createdAt)}
            </Text>
          </Box>

          {session.userId === post.userId && (
            <Flex>
              <Button
                mr="4"
                onClick={() => router.push("/posts/[id]/edit", `/posts/${params.id}/edit`)}
              >
                Edit Post
              </Button>
              <>
                <Button bg="red.400" color="white" onClick={() => setIsModalOpen(true)}>
                  Delete Post
                </Button>

                <AlertDialog
                  isOpen={isModalOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onModalClose}
                >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Post
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onModalClose}>
                        Cancel
                      </Button>
                      <Button
                        bg="red.400"
                        color="white"
                        onClick={async () => {
                          await deletePost({
                            where: {
                              id: post.id,
                            },
                          })

                          onClose()
                          router.back()
                        }}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            </Flex>
          )}
        </Flex>
        <MarkdownPreview content={post?.content || ""} />
        <Flex my="1">
          {post?.tags.map((t) => (
            <Link key={t.name} href={`/posts/tags/[tagName]`} as={`/posts/tags/${t.name}`}>
              <Button mr="2" size="sm">
                #{t.name}
              </Button>
            </Link>
          ))}
        </Flex>
      </Box>

      <Box {...cardStyles} maxW="containers.lg" mx="auto" my="4" p="8">
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
          <Box key={c.id} {...cardStyles} my="4">
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
        id: params?.id,
      },
      include: {
        user: true,
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
