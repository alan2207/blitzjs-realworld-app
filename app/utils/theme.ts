import { theme as presetTheme } from "@chakra-ui/core"
import mergeAll from "lodash/fp/mergeAll"

const customTheme = {
  colors: {
    "bg-dark": presetTheme.colors.blue[700],
    "bg-light": presetTheme.colors.gray[100],
    "text-dark": presetTheme.colors.blue[700],
    "text-light": "white",
  },
}

const theme = mergeAll([presetTheme, customTheme])

export default theme
