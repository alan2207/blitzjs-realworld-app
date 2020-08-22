import { theme as presetTheme } from "@chakra-ui/core"
import mergeAll from "lodash/fp/mergeAll"

const customTheme = {
  colors: {
    "bg-dark": presetTheme.colors.black,
    "bg-light": presetTheme.colors.gray[100],
    "text-dark": presetTheme.colors.black,
    "text-light": "white",
  },
}

const theme = mergeAll([presetTheme, customTheme])

export default theme
