import db, { TagCreateArgs } from "db"

type CreateTagInput = {
  data: TagCreateArgs["data"]
}
export default async function createTag({ data }: CreateTagInput, ctx: Record<any, any> = {}) {
  const tag = await db.tag.create({ data })

  return tag
}
