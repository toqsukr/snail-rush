import { useSession } from '@entities/session'
import { useUser } from '@entities/user'

export const useIsHost = () => {
  const { user } = useUser()
  const { session } = useSession()

  return user?.id === session?.hostID
}
