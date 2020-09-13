import db, { UserUpdateArgs } from "db"

type UpdateUserInput = {
  data: UserUpdateArgs["data"]
}

export default async function updateUser({ data }: UpdateUserInput, ctx: Record<any, any> = {}) {
  ctx.session!.authorize(["admin", "user"])
  const user = await db.user.update({ where: { id: ctx.session.userId }, data })

  return user
}
