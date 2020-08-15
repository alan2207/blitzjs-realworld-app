import React from "react"
import { Head, Link, Router } from "blitz"
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
} from "@chakra-ui/core"
import useAuthUser from "app/auth/hooks/useAuthUser"
import logout from "app/auth/mutations/logout"

const MainLayout = ({ children }) => {
  const [user] = useAuthUser()

  return (
    <>
      <Head>
        <title>Real World App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDir="column">
        <Box bg="bg-dark" color="text-light" h="60px" as="nav">
          <Flex h="100%" marginX="auto" maxW="containers.lg" justify="space-between" align="center">
            <Link href="/">Home</Link>
            <Flex justify="space-between">
              {user ? (
                <Menu>
                  <MenuButton outline="none" as={Button} bg="primary">
                    <Avatar size="xs">
                      <AvatarBadge bg="green.500" />
                    </Avatar>
                  </MenuButton>
                  <MenuList color="black">
                    <MenuGroup title={user.email}>
                      <MenuItem>
                        <Link href="/posts/create">New Post</Link>
                      </MenuItem>
                      <MenuItem>
                        <Link href="/profile">View Profile</Link>
                      </MenuItem>
                      <MenuItem>
                        <Link href="/settings">Settings</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={async () => {
                          await logout()
                          Router.replace("/")
                        }}
                      >
                        Log Out
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
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
        <Box bg="bg-light" color="text-dark" h="calc(100vh - 120px)" overflowY="auto" as="main">
          <Box h="100%" marginX="auto">
            {children}
          </Box>
        </Box>
        <Flex justify="center" align="center" bg="bg-dark" color="text-light" h="60px" as="footer">
          <a
            href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Blitz.js
          </a>
        </Flex>
      </Flex>
    </>
  )
}

export default MainLayout
