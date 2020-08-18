import MainLayout from "app/layouts/MainLayout"
import { Flex } from "@chakra-ui/core"
import Feed from "app/posts/components/Feed"
import { useRouter } from "blitz"
const TagFeedPage = () => {
  const router = useRouter()

  return (
    <MainLayout>
      <Flex py="8" mx="auto" maxW="containers.lg">
        <Feed tagName={router.params.tagName || ""} />
      </Flex>
    </MainLayout>
  )
}

export default TagFeedPage
