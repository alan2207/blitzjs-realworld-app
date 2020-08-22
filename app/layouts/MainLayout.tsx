import React from "react"
import { Head, Link, Router, useRouter } from "blitz"
import {
  Flex,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  AvatarBadge,
  Avatar,
  Button,
  Icon,
} from "@chakra-ui/core"
import useAuthUser from "app/auth/hooks/useAuthUser"
import logout from "app/auth/mutations/logout"

const MainLayout = ({ children, headTitle = "Real World App" }) => {
  const [user] = useAuthUser()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDir="column">
        <Box bg="bg-dark" color="text-light" h="60px" as="nav">
          <Flex h="100%" marginX="auto" maxW="containers.lg" justify="space-between" align="center">
            <Link href="/">Home</Link>
            <Flex justify="space-between">
              {user ? (
                <>
                  <Button onClick={() => router.push("/posts/create")} mr="4" color="text-dark">
                    <Icon mr="2" name="add" />
                    Create Post
                  </Button>
                  <Menu>
                    <MenuButton outline="none" as={Button} bg="primary">
                      <Avatar size="xs">
                        <AvatarBadge bg="green.500" />
                      </Avatar>
                    </MenuButton>
                    <MenuList color="black">
                      <MenuGroup>
                        <MenuItem>
                          <Link href={`/users/${user.id}`}>
                            <Flex flexDir="column">
                              <Box py="1">{user.name}</Box>
                              <Box fontWeight="600" py="1">
                                {user.email}
                              </Box>
                            </Flex>
                          </Link>
                        </MenuItem>
                        <MenuItem py="4">
                          <Link href="/settings">
                            <Box>
                              <Icon mr="2" name="settings" />
                              Settings
                            </Box>
                          </Link>
                        </MenuItem>
                        <MenuItem
                          py="4"
                          onClick={async () => {
                            await logout()
                            Router.replace("/login")
                          }}
                        >
                          <>
                            <Icon mr="2" name="repeat" />
                            Log Out
                          </>
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <>
                  <Box mx={2}>
                    <Link href="/login">Login</Link>
                  </Box>
                  <Box mx={2}>
                    <Link href="/register">Register</Link>
                  </Box>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
        <Box bg="bg-light" color="text-dark" h="calc(100vh - 60px)" overflowY="auto" as="main">
          <Box h="100%" marginX="auto">
            {children}
          </Box>
        </Box>
        {/* <Flex justify="center" align="center" bg="bg-dark" color="text-light" h="60px" as="footer">
          <a
            href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Blitz.js
          </a>
        </Flex> */}
      </Flex>
    </>
  )
}

export default MainLayout
