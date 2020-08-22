import React from "react"
import { Box, Flex, Stack, Tabs, TabList, Tab, Button, Heading } from "@chakra-ui/core"
import { usePaginatedQuery, useSession } from "blitz"
import getPosts from "../queries/getPosts"
import PostList from "../components/PostList"

const ITEMS_PER_PAGE = 5

const Feed = ({ tagName = "" }) => {
  const session = useSession()
  const [page, setPage] = React.useState(0)
  const [feedQuery, setFeedQuery] = React.useState({})
  const [tabIndex, setTabIndex] = React.useState(0)

  React.useEffect(() => {
    const tagQuery = tagName
      ? {
          tags: {
            some: {
              name: {
                contains: tagName,
              },
            },
          },
        }
      : {}
    if (tabIndex === 0) {
      setFeedQuery({ ...tagQuery })
    } else if (tabIndex === 1) {
      setFeedQuery({
        User: {
          followedBy: {
            some: {
              id: {
                equals: session.userId,
              },
            },
          },
        },
        ...tagQuery,
      })
    }
  }, [tabIndex, session.userId, tagName])

  const [{ posts, hasMore }, { refetch }] = usePaginatedQuery(getPosts, {
    where: feedQuery,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    include: {
      User: true,
      favoritedBy: true,
      tags: true,
    },
  })

  return (
    <Stack spacing="4" w="100%">
      {tagName && <Heading># {tagName}</Heading>}
      <Box w="100%">
        <Tabs onChange={setTabIndex} index={tabIndex}>
          <TabList>
            <Tab>Global Feed</Tab>
            {session.userId && <Tab>Personal Feed</Tab>}
          </TabList>

          <PostList refetch={refetch} posts={posts} />
          <Flex align="center" justify="space-between">
            <Button isDisabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Box>Page {page + 1}</Box>
            <Button isDisabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </Flex>
        </Tabs>
      </Box>
    </Stack>
  )
}

export default Feed
