import React from "react"
import { useRouter, useQuery, useParam, BlitzPage, useSession } from "blitz"
import getUser from "app/users/queries/getUser"
import MainLayout from "app/layouts/MainLayout"
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  Text,
} from "@chakra-ui/core"
import followOrUnfollowUser from "app/users/mutations/followOrUnfollowUser"
import PostList from "app/posts/components/PostList"
import UserList from "app/users/components/UserList"

const ShowUserPage: BlitzPage = () => {
  const { colorMode } = useColorMode()
  const router = useRouter()
  const session = useSession()
  const userId = useParam("userId", "string")
  const [user, { refetch }] = useQuery(getUser, {
    where: {
      id: userId,
    },
    include: {
      followedBy: true,
      following: true,
      favorites: {
        where: {
          status: "published",
        },
        include: {
          favoritedBy: true,
          user: true,
          tags: true,
        },
      },
      posts: {
        where: {
          status: "published",
        },
        include: {
          favoritedBy: true,
          user: true,
          tags: true,
        },
      },
    },
  })

  const isAlreadyFollowing = !!user?.followedBy?.find((f) => f.id === session?.userId)

  const toggleFollow = async () => {
    const operation = isAlreadyFollowing ? "disconnect" : "connect"
    if (!session.userId) return
    try {
      await followOrUnfollowUser({ userId, operation })
      refetch()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <MainLayout headTitle={user.name || "User"}>
      <Box>
        <Flex
          bg={colorMode === "light" ? "gray.200" : "gray.700"}
          justify="center"
          align="center"
          p="8"
        >
          <Box textAlign="center">
            <Avatar size="xl" />
            <Heading textAlign="center">{user.name}</Heading>
            <Text maxW="containers.lg" my="4" fontSize="lg">
              {user.bio}
            </Text>
            {session?.userId === userId ? (
              <Button
                onClick={() => router.push("/profile/settings")}
                my="4"
                variant="outline"
                variantColor="primary"
              >
                Settings
              </Button>
            ) : (
              session?.userId && (
                <Button onClick={toggleFollow} my="4" variant="outline" variantColor="primary">
                  {isAlreadyFollowing ? "Unfollow" : "Follow"}
                </Button>
              )
            )}
          </Box>
        </Flex>
        <Tabs mt="4" maxW="containers.lg" mx="auto">
          <TabList>
            <Tab>Articles</Tab>
            <Tab>Favorites</Tab>
            <Tab>Followers</Tab>
            <Tab>Following</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <PostList posts={user.posts} refetch={refetch} />
            </TabPanel>
            <TabPanel>
              <PostList posts={user.favorites} refetch={refetch} />
            </TabPanel>
            <TabPanel>
              <UserList users={user.followedBy} />
            </TabPanel>
            <TabPanel>
              <UserList users={user.following} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  )
}

export default ShowUserPage
