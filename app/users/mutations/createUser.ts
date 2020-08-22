import db, { UserCreateArgs } from "db"

type CreateUserInput = {
  data: UserCreateArgs["data"]
}
export default async function createUser({ data }: CreateUserInput, ctx: Record<any, any> = {}) {
  ctx.session?.authorize(["admin"])
  const user = await db.user.create({ data })

  return user
}
