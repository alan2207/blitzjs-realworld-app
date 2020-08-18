import React from "react"
import { Box, Flex, Heading, Text, Button, Icon } from "@chakra-ui/core"
import { Link, useSession } from "blitz"
import { cardStyles } from "app/styles"
import updatePost from "../mutations/updatePost"

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
    ? { bg: "yellow.200", color: "black" }
    : { bg: "gray.200", color: "white" }

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
      <Flex justify="space-between" align="center">
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
  return (
    <Box w="100%">
      {posts.map((p) => (
        <Post refetch={refetch} post={p} />
      ))}
    </Box>
  )
}

export default PostList
