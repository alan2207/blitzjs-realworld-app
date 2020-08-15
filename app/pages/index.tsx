import useAuthUser from "app/auth/hooks/useAuthUser"
import MainLayout from "app/layouts/MainLayout"
import { Flex } from "@chakra-ui/core"
import Feed from "app/posts/components/Feed"
const Home = () => {
  const user = useAuthUser()

  console.log(user)
  return (
    <MainLayout>
      <Flex py="8" mx="auto" maxW="containers.lg">
        <Feed />
      </Flex>
    </MainLayout>
  )
}

export default Home
