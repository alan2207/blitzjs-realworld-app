import db, { FindManyTagArgs } from "db"

type GetTagsInput = {
  where?: FindManyTagArgs["where"]
  orderBy?: FindManyTagArgs["orderBy"]
  cursor?: FindManyTagArgs["cursor"]
  take?: FindManyTagArgs["take"]
  skip?: FindManyTagArgs["skip"]
  // Only available if a model relationship exists
  // include?: FindManyTagArgs['include']
}

export default async function getTags(
  { where, orderBy, cursor, take, skip }: GetTagsInput,
  ctx: Record<any, any> = {}
) {
  const tags = await db.tag.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return tags
}
