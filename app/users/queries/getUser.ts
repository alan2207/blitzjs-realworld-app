import db, { FindOneUserArgs } from "db"
import { SessionContext, NotFoundError } from "blitz"

type GetUserInput = {
  where: FindOneUserArgs["where"]
  select?: FindOneUserArgs["select"]
  include?: FindOneUserArgs["include"]
}

export default async function getUser(
  { where, select, include }: GetUserInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize(["admin", "user"])

  const user = await db.user.findOne({ where, select, include })

  if (!user) throw new NotFoundError(`User with id ${where.id} does not exist`)

  return user
}
