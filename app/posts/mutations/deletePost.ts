import db, { PostDeleteArgs } from "db"

type DeletePostInput = {
  where: PostDeleteArgs["where"]
}

export default async function deletePost({ where }: DeletePostInput, ctx: Record<any, any> = {}) {
  const post = await db.post.delete({ where })

  return post
}
