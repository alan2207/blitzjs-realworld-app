import React from "react"
import MainLayout from "app/layouts/MainLayout"
import { Heading, Box, Tabs, TabList, Tab, Flex, Button } from "@chakra-ui/core"
import { usePaginatedQuery, useSession } from "blitz"
import getPostsPaginated from "app/posts/queries/getPostsPaginated"
import PostList from "app/posts/components/PostList"

const ITEMS_PER_PAGE = 5

const PostsPage = () => {
  const session = useSession()
  const [page, setPage] = React.useState(0)
  const [tabIndex, setTabIndex] = React.useState(0)
  const [statusQuery, setStatusQuery] = React.useState({})

  const [response, { refetch }] = usePaginatedQuery(
    getPostsPaginated,
    {
      where: {
        userId: session?.userId,
        ...statusQuery,
      },
      skip: ITEMS_PER_PAGE * page,
      take: ITEMS_PER_PAGE,
      include: {
        user: true,
        favoritedBy: true,
        tags: true,
      },
    },
    {
      enabled: !!session?.userId,
    }
  )

  React.useEffect(() => {
    if (tabIndex === 0) {
      setStatusQuery({})
    } else if (tabIndex === 1) {
      setStatusQuery({ status: "draft" })
    } else if (tabIndex === 2) {
      setStatusQuery({ status: "published" })
    }
    setPage(0)
  }, [tabIndex])

  return (
    <MainLayout headTitle="My Posts">
      <Box maxW="containers.lg" mx="auto">
        <Heading my="4">My Posts</Heading>
        <Tabs onChange={setTabIndex} index={tabIndex}>
          <TabList mb="8">
            <Tab>All Posts</Tab>
            <Tab>In Draft</Tab>
            <Tab>Published</Tab>
          </TabList>
          <PostList refetch={refetch} posts={response?.posts || []} />
          {response?.posts.length > 0 && (
            <Flex align="center" justify="space-between">
              <Button isDisabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Box>Page {page + 1}</Box>
              <Button isDisabled={!response?.hasMore} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </Flex>
          )}
        </Tabs>
      </Box>
    </MainLayout>
  )
}

export default PostsPage
