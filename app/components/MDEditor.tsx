import dynamic from "next/dynamic"

const MdEditorLite = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
})

export default function MDEditor(props) {
  return <MdEditorLite {...props} />
}
