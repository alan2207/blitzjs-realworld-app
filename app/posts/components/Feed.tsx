import React from "react"
import { Box, Flex, Stack, Tabs, TabList, Tab, Button, Heading } from "@chakra-ui/core"
import { useSession, useInfiniteQuery } from "blitz"
import getPosts from "../queries/getPosts"
import PostList from "../components/PostList"

const Feed = ({ tagName = "" }) => {
  const session = useSession()
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
    } else if (tabIndex === 1 && session.userId) {
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

  const [postGroups, { refetch, isFetchingMore, fetchMore, canFetchMore }] = useInfiniteQuery(
    getPosts,
    {
      where: feedQuery,
      skip: 0,
      take: 5,
      include: {
        User: true,
        favoritedBy: true,
        tags: true,
      },
    },
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
    }
  )

  return (
    <Stack spacing="4" w="100%">
      {tagName && <Heading># {tagName}</Heading>}
      <Box w="100%">
        <Tabs onChange={setTabIndex} index={tabIndex}>
          <TabList>
            <Tab>Global Feed</Tab>
            {session.userId && <Tab>Personal Feed</Tab>}
          </TabList>

          {postGroups.map(({ posts }, i) => (
            <PostList key={i} refetch={refetch} posts={posts} />
          ))}
          {postGroups.length > 0 && (
            <Flex mt="4" justify="center" align="center">
              <Button
                bg="bg-dark"
                color="text-light"
                isLoading={!!isFetchingMore}
                onClick={() => fetchMore()}
                isDisabled={!canFetchMore || !!isFetchingMore}
              >
                {canFetchMore ? "Load More Posts" : "That's All Folks :)"}
              </Button>
            </Flex>
          )}
        </Tabs>
      </Box>
    </Stack>
  )
}

export default Feed
