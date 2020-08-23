import React from "react"
import marked from "marked"
import DOMPurify from "isomorphic-dompurify"
import { Box } from "@chakra-ui/core"
import Prism from "prismjs"

const MarkdownPreview = ({ content }) => {
  return (
    <Box
      w="100%"
      className="markdown-preview"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          marked(content, {
            highlight: function (code, lang) {
              return Prism.highlight(code, Prism.languages[lang], lang)
            },
          })
        ),
      }}
    ></Box>
  )
}

export default MarkdownPreview
