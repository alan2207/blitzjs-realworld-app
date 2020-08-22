export const cardStyles = (colorMode = "light") => ({
  borderRadius: "md",
  shadow: "md",
  bg: colorMode === "light" ? "white" : "gray.800",
  p: "8",
  border: "1px solid lightgray",
})
