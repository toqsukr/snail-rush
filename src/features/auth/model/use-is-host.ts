import { useSession } from '@entities/session'

export const useIsHost = () => {
  const { session } = useSession()

  return (playerID: string) => playerID === session?.hostID
}
