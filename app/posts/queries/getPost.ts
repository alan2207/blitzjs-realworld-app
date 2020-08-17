import { NotFoundError } from "blitz"
import db, { FindOnePostArgs } from "db"

type GetPostInput = {
  where: FindOnePostArgs["where"]
  // Only available if a model relationship exists
  include?: FindOnePostArgs["include"]
}

export default async function getPost(
  { where, include }: GetPostInput,
  ctx: Record<any, any> = {}
) {
  const post = await db.post.findOne({ where, include })

  if (!post) throw new NotFoundError()

  return post
}
