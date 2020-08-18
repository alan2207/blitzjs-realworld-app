import React from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage, useSession } from "blitz"
import getUser from "app/users/queries/getUser"
import MainLayout from "app/layouts/MainLayout"
import { Box, Flex, Heading, Avatar, Button } from "@chakra-ui/core"
import updateUser from "app/users/mutations/updateUser"

const ShowUserPage: BlitzPage = () => {
  const router = useRouter()
  const session = useSession()
  const userId = useParam("userId", "number")
  const [user, { mutate }] = useQuery(getUser, {
    where: {
      id: userId,
    },
    include: {
      followedBy: true,
      following: true,
      favorites: true,
    },
  })

  const isAlreadyFollowing = !!user?.followedBy?.find((f) => f.id == session?.userId)

  const toggleFollow = async () => {
    const operation = isAlreadyFollowing ? "disconnect" : "connect"
    if (!session.userId) return
    try {
      const user = await updateUser({
        where: {
          id: userId,
        },
        data: {
          followedBy: {
            [operation]: [{ id: +session?.userId }],
          },
        },
      })
      mutate(user)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <MainLayout>
      <Head>
        <title>{user.name || "User"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex bg="gray.200" justify="center" align="center" p="8">
          <Box textAlign="center">
            <Avatar size="xl" />
            <Heading textAlign="center">{user.name}</Heading>
            {session.userId === userId ? (
              <Button my="4" variant="outline" variantColor="primary">
                Settings
              </Button>
            ) : (
              <Button onClick={toggleFollow} my="4" variant="outline" variantColor="primary">
                {isAlreadyFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>
        </Flex>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Box>
    </MainLayout>
  )
}

export default ShowUserPage
