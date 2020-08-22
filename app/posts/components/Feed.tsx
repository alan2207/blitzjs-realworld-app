import React from "react"
import { Box, Flex, Stack, Tabs, TabList, Tab, Button, Heading } from "@chakra-ui/core"
import { useSession, useInfiniteQuery, useQuery, Link } from "blitz"
import getPosts from "../queries/getPosts"
import PostList from "../components/PostList"
import getTags from "app/tags/queries/getTags"

const Feed = ({ tagName = "" }) => {
  const session = useSession()
  const [feedQuery, setFeedQuery] = React.useState({})
  const [tabIndex, setTabIndex] = React.useState(0)

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

  const [tags] = useQuery(getTags, {})

  console.log(tags)

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

  return (
    <Stack isInline spacing="4" w="100%">
      <Box w="80%">
        {tagName && <Heading># {tagName}</Heading>}
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
      <Box w="20%">
        <Heading mb="4" size="md">
          Tags:
        </Heading>
        <Flex flexDir="column">
          {tags.map((tag) => (
            <Box p="2">
              <Link href={`/tags/${tag.name}`}>{"#" + tag.name}</Link>
            </Box>
          ))}
        </Flex>
      </Box>
    </Stack>
  )
}

export default Feed
