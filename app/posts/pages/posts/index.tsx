import React from "react"
import MainLayout from "app/layouts/MainLayout"
import { Heading, Box, Tabs, TabList, Tab } from "@chakra-ui/core"
import { useQuery, useSession } from "blitz"
import getPosts from "app/posts/queries/getPosts"
import PostList from "app/posts/components/PostList"

const PostsPage = () => {
  const session = useSession()
  const [tabIndex, setTabIndex] = React.useState(0)
  const [statusQuery, setStatusQuery] = React.useState({})

  const [posts, { refetch }] = useQuery(
    getPosts,
    {
      where: {
        userId: session?.userId,
        ...statusQuery,
      },
      include: {
        User: true,
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
          <PostList posts={posts} refetch={refetch} />
        </Tabs>
      </Box>
    </MainLayout>
  )
}

export default PostsPage
