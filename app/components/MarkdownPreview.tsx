import React from "react"
import marked from "marked"
import DOMPurify from "isomorphic-dompurify"
import { Box } from "@chakra-ui/core"

const MarkdownPreview = ({ content }) => {
  return (
    <Box
      p="8"
      w="100%"
      className="markdown-preview"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(content)),
      }}
    />
  )
}

export default MarkdownPreview
