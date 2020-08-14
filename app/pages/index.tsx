import useAuthUser from "app/auth/hooks/useAuthUser"
import MainLayout from "app/layouts/MainLayout"
import { Box } from "@chakra-ui/core"
const Home = () => {
  const user = useAuthUser()

  console.log(user)
  return (
    <MainLayout>
      <Box h="2000px">Hello</Box>
    </MainLayout>
  )
}

export default Home
