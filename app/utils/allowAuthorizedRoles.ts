import { getSessionContext } from "@blitzjs/server"

type Props = {
  roles: string[]
  redirectRoute?: string
  req: any
  res: any
}
const allowAuthorizedRoles = async ({ req, res, roles = [], redirectRoute = "/" }: Props) => {
  const session = await getSessionContext(req, res)
  try {
    session?.authorize(roles)
  } catch (err) {
    res.setHeader("location", redirectRoute)
    res.statusCode = 302
    res.end()
  }

  return session
}

export default allowAuthorizedRoles
