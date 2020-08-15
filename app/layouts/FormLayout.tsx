import React from "react"
import { Box, Heading } from "@chakra-ui/core"
import { cardStyles } from "app/styles"

const FormLayout = ({ children, title }) => {
  return (
    <Box {...cardStyles} minWidth="containers.sm">
      <Heading textAlign="center" mb="4">
        {title}
      </Heading>
      {children}
    </Box>
  )
}

export default FormLayout
