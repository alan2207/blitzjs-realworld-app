import React from "react"
import { Box, Heading, useColorMode } from "@chakra-ui/core"
import { cardStyles } from "app/styles"

const FormLayout = ({ children, title }) => {
  const { colorMode } = useColorMode()
  return (
    <Box {...cardStyles(colorMode)} w="100%" mx="auto" maxW="containers.lg">
      <Heading textAlign="center" mb="4">
        {title}
      </Heading>
      {children}
    </Box>
  )
}

export default FormLayout
