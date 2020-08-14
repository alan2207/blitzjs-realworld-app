import db, { TagDeleteArgs } from "db"

type DeleteTagInput = {
  where: TagDeleteArgs["where"]
}

export default async function deleteTag({ where }: DeleteTagInput, ctx: Record<any, any> = {}) {
  const tag = await db.tag.delete({ where })

  return tag
}
