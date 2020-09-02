import React from "react"
import { Box, Heading } from "@chakra-ui/core"
import { useElementStyles } from "app/styles"

const FormLayout = ({ children, title }) => {
  const { cardStyles } = useElementStyles()
  return (
    <Box {...cardStyles} w="100%" mx="auto" maxW="containers.lg">
      <Heading textAlign="center" mb="4">
        {title}
      </Heading>
      {children}
    </Box>
  )
}

export default FormLayout
