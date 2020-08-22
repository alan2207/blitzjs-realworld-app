import MainLayout from "app/layouts/MainLayout"
import { Flex } from "@chakra-ui/core"
import Feed from "app/posts/components/Feed"
import { useRouter } from "blitz"
const TagFeedPage = () => {
  const router = useRouter()

  const tagName = router?.params?.tagName || ""
  return (
    <MainLayout headTitle={tagName}>
      <Flex py="8" mx="auto" maxW="containers.lg">
        <Feed tagName={tagName} />
      </Flex>
    </MainLayout>
  )
}

export default TagFeedPage
