import { useColorMode } from "@chakra-ui/core"

const makeCardStyles = (colorMode = "light") => ({
  borderRadius: "md",
  shadow: "md",
  bg: colorMode === "light" ? "white" : "gray.800",
  p: "8",
  border: colorMode === "light" ? "none" : "1px solid grey",
})

export const useElementStyles = () => {
  const { colorMode } = useColorMode()

  return {
    cardStyles: makeCardStyles(colorMode),
  }
}
