import React from "react"
import { Box, Heading, Flex, Button, Icon, useColorMode } from "@chakra-ui/core"
import { cardStyles } from "app/styles"
import { useRouter } from "blitz"
import EmptyList from "app/components/EmptyList"

const UserList = ({ users }) => {
  const { colorMode } = useColorMode()
  const router = useRouter()
  if (!users?.length) {
    return <EmptyList />
  }
  return (
    <Box>
      {users.map((u) => (
        <Flex justify="space-between" align="center" {...cardStyles(colorMode)} my="2">
          <Heading size="sm">{u.name}</Heading>
          <Button onClick={() => router.push("/users/[userId]", `/users/${u.id}`)}>
            <Icon name="info" mr="2" /> Info
          </Button>
        </Flex>
      ))}
    </Box>
  )
}

export default UserList
