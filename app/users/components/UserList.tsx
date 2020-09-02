import React from "react"
import { Box, Heading, Flex, Button, Icon } from "@chakra-ui/core"
import { useElementStyles } from "app/styles"
import { useRouter } from "blitz"
import EmptyList from "app/components/EmptyList"

const UserList = ({ users }) => {
  const { cardStyles } = useElementStyles()
  const router = useRouter()
  if (!users?.length) {
    return <EmptyList />
  }
  return (
    <Box>
      {users.map((u) => (
        <Flex justify="space-between" align="center" {...cardStyles} my="2">
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
