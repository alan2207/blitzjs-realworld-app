import React from "react"
import { Box, Heading } from "@chakra-ui/core"

const FormLayout = ({ children, title }) => {
  return (
    <Box shadow="lg" bg="white" p="8" width="container.xl">
      <Heading textAlign="center" mb="4">
        {title}
      </Heading>
      {children}
    </Box>
  )
}

export default FormLayout
