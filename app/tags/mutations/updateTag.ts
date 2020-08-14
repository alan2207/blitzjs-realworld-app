import db, { TagUpdateArgs } from "db"

type UpdateTagInput = {
  where: TagUpdateArgs["where"]
  data: TagUpdateArgs["data"]
}

export default async function updateTag(
  { where, data }: UpdateTagInput,
  ctx: Record<any, any> = {}
) {
  const tag = await db.tag.update({ where, data })

  return tag
}
