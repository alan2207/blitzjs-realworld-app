import MainLayout from "app/layouts/MainLayout"
import { Flex } from "@chakra-ui/core"
import Feed from "app/posts/components/Feed"
import { useParams } from "blitz"
const TagFeedPage = () => {
  const params = useParams("string")

  const tagName = params?.tagName
  return (
    <MainLayout headTitle={tagName}>
      <Flex py="8" mx="auto" maxW="containers.lg">
        <Feed tagName={tagName} />
      </Flex>
    </MainLayout>
  )
}

export default TagFeedPage
