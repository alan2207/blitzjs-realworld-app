import React from "react"
import {
  Box,
  Flex,
  Tag,
  Heading,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/core"
import { useQuery, usePaginatedQuery } from "blitz"
import getTags from "app/tags/queries/getTags"
import { cardStyles } from "app/styles"
import getPosts from "../queries/getPosts"
import PostList from "../components/PostList"

const ITEMS_PER_PAGE = 5

const Feed = () => {
  const [page, setPage] = React.useState(0)
  const [feedQuery, setFeedQuery] = React.useState({})
  const [selectedTag, setSelectedTag] = React.useState("")
  const [tabIndex, setTabIndex] = React.useState(0)
  const [tags] = useQuery(getTags, {})
  React.useEffect(() => {
    if (selectedTag) {
      setTabIndex(2)
    } else {
      setTabIndex(0)
    }
  }, [selectedTag])

  React.useEffect(() => {
    setPage(0)
    if (tabIndex === 0) {
      setFeedQuery({})
    } else if (tabIndex === 1) {
      setFeedQuery({})
    } else if (tabIndex === 2) {
      setFeedQuery({
        tags: {
          some: {
            name: {
              contains: selectedTag,
            },
          },
        },
      })
    }
  }, [tabIndex, selectedTag])

  console.log({ feedQuery })
  const [{ posts, hasMore }] = usePaginatedQuery(getPosts, {
    where: feedQuery,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    include: {
      User: true,
    },
  })
  console.log(selectedTag)
  return (
    <Stack spacing="4" isInline w="100%">
      <Box w="70%">
        <Tabs onChange={setTabIndex} index={tabIndex}>
          <TabList>
            <Tab>Global Feed</Tab>
            <Tab>Personal Feed</Tab>
            {selectedTag && <Tab>{selectedTag} Feed</Tab>}
          </TabList>

          <PostList posts={posts} />
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
