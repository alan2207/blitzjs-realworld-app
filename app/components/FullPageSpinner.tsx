import React from "react"
import { Flex, Spinner } from "@chakra-ui/core"

const FullPageSpinner = () => {
  return (
    <Flex h="100vh" w="100wv" justify="center" align="center">
      <Spinner size="xl" />
    </Flex>
  )
}

export default FullPageSpinner
