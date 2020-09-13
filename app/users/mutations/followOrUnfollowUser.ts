import db from "db"

type FollowOrUnfollowUserInput = {
  userId: string
  operation: "connect" | "disconnect"
}

export default async function updateUser(
  { userId, operation }: FollowOrUnfollowUserInput,
  ctx: Record<any, any> = {}
) {
  ctx.session!.authorize(["admin", "user"])

  const user = await await db.user.update({
    where: {
      id: userId,
    },
    data: {
      followedBy: {
        [operation]: [{ id: ctx.session?.userId }],
      },
    },
  })

  return user
}
