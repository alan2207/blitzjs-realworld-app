import { NotFoundError } from "blitz"
import db, { FindOneTagArgs } from "db"

type GetTagInput = {
  where: FindOneTagArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneTagArgs['include']
}

export default async function getTag(
  { where /* include */ }: GetTagInput,
  ctx: Record<any, any> = {}
) {
  const tag = await db.tag.findOne({ where })

  if (!tag) throw new NotFoundError()

  return tag
}
