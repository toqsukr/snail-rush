import { resetSession, useSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import { useDisconnect } from '../api/disconnect-session'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useDisconnectLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { data: session } = useSession()
  const deleteSession = useSessionCode(s => s.deleteSession)
  const disconnectYourself = useDisconnect()
  const { data: user } = useUser()
  const { onDisconnectLobby } = useLobbyMenuDeps()

  return async () => {
    if (!user || !session) return

    disconnectLobby()
    onDisconnectLobby()
    await disconnectYourself.mutateAsync({ sessionID: session.id, playerID: user.id })
    deleteSession()
    resetSession()
  }
}
