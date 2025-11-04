import { resetSession, useSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useDisconnectLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { data: session } = useSession()
  const deleteSession = useSessionCode(s => s.deleteSession)
  const { data: user } = useUser()
  const { onDisconnectLobby } = useLobbyMenuDeps()

  return async () => {
    if (!user || !session) return

    disconnectLobby()
    onDisconnectLobby()
    deleteSession()
    resetSession()
  }
}
