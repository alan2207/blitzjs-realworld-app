import React from "react"
import { Box, Flex, Tag, Heading, Stack, Text } from "@chakra-ui/core"
import { useQuery, Link } from "blitz"
import getTags from "app/tags/queries/getTags"
import { cardStyles } from "app/styles"
import getPosts from "../queries/getPosts"

const Post = ({ post }) => {
  return (
    <Flex flexDir="column" {...cardStyles} my="2">
      <Text>{post.User?.name}</Text>
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
const Feed = () => {
  const [selectedTag, setSelectedTag] = React.useState("")
  const [tags] = useQuery(getTags, {})
  const query = selectedTag
    ? {
        tags: {
          some: {
            name: {
              contains: selectedTag,
            },
          },
        },
      }
    : {}
  console.log({ query })
  const [posts] = useQuery(getPosts, {
    where: query,
    include: {
      User: true,
    },
  })
  console.log(selectedTag)
  return (
    <Stack spacing="4" isInline w="100%">
      <Box w="70%">
        {posts.map((p) => (
          <Post post={p} />
        ))}
      </Box>
      <Box w="30%">
        <Box {...cardStyles} p="3" my="2">
          <Heading my="4" size="md">
            Tags
          </Heading>
          <Flex w="100%" flexWrap="wrap">
            {tags.map((t) => (
              <Tag
                onClick={() => setSelectedTag(selectedTag === t.name ? "" : t.name)}
                m="1"
                bg={selectedTag === t.name ? "bg-light" : "bg-dark"}
                color={selectedTag === t.name ? "text-dark" : "text-light"}
              >
                {t.name}
              </Tag>
            ))}
          </Flex>
        </Box>
      </Box>
    </Stack>
  )
}

export default Feed
