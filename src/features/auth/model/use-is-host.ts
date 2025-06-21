import { useSession } from '@entities/session'

export const useIsHost = () => {
  const { data: session } = useSession()

  return (playerID: string) => playerID === session?.hostID
}
