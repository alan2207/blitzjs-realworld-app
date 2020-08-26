import MainLayout from "app/layouts/MainLayout"
import { Flex } from "@chakra-ui/core"
import Feed from "app/posts/components/Feed"
const Home = () => {
  return (
    <MainLayout headTitle="Home">
      <Flex py="8" mx="auto" maxW="containers.lg">
        <Feed />
      </Flex>
    </MainLayout>
  )
}

export default Home
