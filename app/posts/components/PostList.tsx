import React from "react"
import { Box, Flex, Heading, Text } from "@chakra-ui/core"
import { Link } from "blitz"
import { cardStyles } from "app/styles"

const Post = ({ post }) => {
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
      <Link href={`/posts/${post.id}`}>Read More</Link>
    </Flex>
  )
}

const PostList = ({ posts }) => {
  return (
    <Box w="100%">
      {posts.map((p) => (
        <Post post={p} />
      ))}
    </Box>
  )
}

export default PostList
