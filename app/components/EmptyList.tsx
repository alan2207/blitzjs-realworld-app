import React from "react"
import { Flex, Box, Icon, Text } from "@chakra-ui/core"

const EmptyList = () => {
  return (
    <Flex
      flexDir="column"
      mt="2"
      width="100%"
      bg="gray.200"
      justify="center"
      align="center"
      height="300px"
      borderRadius="md"
    >
      <Icon name="not-allowed" size="3em" />
      <Text fontSize="3xl">The List Is Empty</Text>
    </Flex>
  )
}

export default EmptyList
