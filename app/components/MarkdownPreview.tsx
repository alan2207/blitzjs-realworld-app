import React from "react"
import { Box } from "@chakra-ui/core"
import ReactMarkdown from "react-markdown"
import MDXComponents from "./MDXComponents"

const MarkdownPreview = ({ content }) => {
  return (
    <Box w="100%">
      <ReactMarkdown
        source={content}
        renderers={{
          paragraph: MDXComponents.p,
          blockquote: MDXComponents.blockquote,
          link: MDXComponents.a,
          list: MDXComponents.ul,
          listItem: MDXComponents.li,
          table: MDXComponents.table,
          tableHead: MDXComponents.th,
          tableCell: MDXComponents.td,
          heading: MDXComponents.heading,
          code: MDXComponents.code,
          inlineCode: MDXComponents.inlineCode,
        }}
      />
    </Box>
  )
}

export default MarkdownPreview
