import db, { CommentCreateArgs } from "db"

type CreateCommentInput = {
  data: CommentCreateArgs["data"]
}
export default async function createComment(
  { data }: CreateCommentInput,
  ctx: Record<any, any> = {}
) {
  ctx.session!.authorize(["admin", "user"])
  const comment = await db.comment.create({ data })

  return comment
}
