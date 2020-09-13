import db, { PostCreateArgs } from "db"

type CreatePostInput = {
  data: PostCreateArgs["data"]
}
export default async function createPost({ data }: CreatePostInput, ctx: Record<any, any> = {}) {
  ctx.session!.authorize(["admin", "user"])
  const post = await db.post.create({ data })

  return post
}
