import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useDisconnect } from '../api/disconnect-session'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useDisconnectLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { session, deleteSession } = useSession()
  const disconnectYourself = useDisconnect()
  const { data: user } = useUser()
  const { onDisconnectLobby } = useLobbyMenuDeps()

  return async () => {
    if (!user || !session) return

    disconnectLobby()
    await disconnectYourself.mutateAsync({ sessionID: session.id, playerID: user.id })
    deleteSession() // ?
    onDisconnectLobby()
  }
}
