import { useSession } from "blitz"
import { useQuery } from "blitz"
import getUser from "app/users/queries/getUser"

const useAuthUser = () => {
  const session = useSession()

  const user = useQuery(getUser, { where: { id: session.userId } }, { enabled: !!session.userId })

  return user
}

export default useAuthUser
