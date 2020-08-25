import db, { FindManyPostArgs } from "db"

type GetPostsInfiniteInput = {
  where?: FindManyPostArgs["where"]
  orderBy?: FindManyPostArgs["orderBy"]
  cursor?: FindManyPostArgs["cursor"]
  take?: FindManyPostArgs["take"]
  skip?: FindManyPostArgs["skip"]
  // Only available if a model relationship exists
  include?: FindManyPostArgs["include"]
}

export default async function getPostsInfinite(
  { where, orderBy, cursor, take, skip, include }: GetPostsInfiniteInput,
  ctx: Record<any, any> = {}
) {
  const posts = await db.post.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
    include,
  })

  const count = await db.post.count({ where })
  const hasMore = skip! + take! < count
  const nextPage = hasMore ? { take, skip: skip! + take! } : null

  return { posts, nextPage }
}
