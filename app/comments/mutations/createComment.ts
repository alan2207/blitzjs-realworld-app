import db, { CommentCreateArgs } from "db"

type CreateCommentInput = {
  data: CommentCreateArgs["data"]
}
export default async function createComment(
  { data }: CreateCommentInput,
  ctx: Record<any, any> = {}
) {
  const comment = await db.comment.create({ data })

  return comment
}
