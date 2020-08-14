import { SessionContext } from "blitz"
import { authenticateUser } from "app/auth"

export default async function login(input, ctx: { session?: SessionContext } = {}) {
  // This throws an error if input is invalid
  const { email, password } = input

  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await ctx.session!.create({ userId: user.id, roles: [user.role] })

  return user
}
