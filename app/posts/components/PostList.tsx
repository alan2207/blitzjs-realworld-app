import React from "react"
import { Box, Flex, Heading, Text, Button, Icon } from "@chakra-ui/core"
import { Link, useSession } from "blitz"
import { cardStyles } from "app/styles"
import updatePost from "../mutations/updatePost"
import EmptyList from "app/components/EmptyList"

const Post = ({ post, refetch }) => {
  const session = useSession()
  console.log("asdlasjdlasjkd")
  console.log({ post })
  const isAlreadyFavoriting = !!post?.favoritedBy?.find((f) => f.id == session?.userId)

  const toggleFavorite = async () => {
    const operation = isAlreadyFavoriting ? "disconnect" : "connect"
    if (!session.userId) return
    try {
      await updatePost({
        where: {
          id: post.id,
        },
        data: {
          favoritedBy: {
            [operation]: [{ id: +session?.userId }],
          },
        },
      })
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const toggleButtonStyles = isAlreadyFavoriting
    ? { bg: "black", color: "white" }
    : { bg: "white", color: "black" }

  const favoriteCount = post?.favoritedBy?.length

  return (
    <Flex flexDir="column" {...cardStyles} my="2">
      <Link href={`/users/${post.userId}`}>{post.User?.name || "User"}</Link>
      <Text mb="2" color="gray.500" fontSize="xs">
        {post.createdAt}
      </Text>
      <Heading size="lg">{post.title}</Heading>
      <Text my="1" mb="4">
        {post.intro}
      </Text>
      <Flex my="1">
        {post.tags.map((t) => (
          <Link href={`/tags/${t.name}`}>
            <Button mr="2" size="sm">
              #{t.name}
            </Button>
          </Link>
        ))}
      </Flex>
      <Flex justify="space-between" align="flex-end">
        <Link href={`/posts/${post.id}`}>Read More</Link>{" "}
        <Button variant="outline" onClick={toggleFavorite} {...toggleButtonStyles}>
          <Icon mr="2" name="star" />
          <Text>{favoriteCount}</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

const PostList = ({ posts, refetch }) => {
  if (!posts?.length) {
    return <EmptyList />
  }
  return (
    <Box w="100%">
      {posts.map((p) => (
        <Post refetch={refetch} post={p} />
      ))}
    </Box>
  )
}

export default PostList
