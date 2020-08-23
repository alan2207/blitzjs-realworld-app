import React from "react"
import { Flex, Box, Icon, Text, useColorMode } from "@chakra-ui/core"

const EmptyList = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex
      flexDir="column"
      mt="2"
      width="100%"
      bg={colorMode === "light" ? "gray.200" : "gray.800"}
      justify="center"
      align="center"
      height="300px"
      borderRadius="md"
    >
      <Icon name="not-allowed" size="3em" />
      <Text fontSize="3xl">Empty</Text>
    </Flex>
  )
}

export default EmptyList
