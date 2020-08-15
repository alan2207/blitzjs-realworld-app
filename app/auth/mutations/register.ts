import db from "db"
import { SessionContext } from "blitz"
import { hashPassword } from "app/auth"

export default async function register(input, ctx: { session?: SessionContext } = {}) {
  // This throws an error if input is invalid
  const { email, password, name } = input

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email, hashedPassword, name, role: "user" },
    select: { id: true, name: true, email: true, role: true },
  })

  await ctx.session!.create({ userId: user.id, roles: [user.role] })

  return user
}
