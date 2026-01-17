import { useSession } from '../query'

export const useIsHost = () => {
  const { data: session } = useSession()

  return (playerID: string) => playerID === session?.hostID
}
