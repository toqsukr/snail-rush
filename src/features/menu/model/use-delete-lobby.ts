import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useDeleteSession } from '../api/delete-session'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useDeleteLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { session, deleteSession } = useSession()
  const user = useUser(s => s.user)
  const { isHost, onDeleteLobby } = useLobbyMenuDeps()
  const removeSession = useDeleteSession()

  return () => {
    if (!session?.id || (user && !isHost(user.id))) return

    disconnectLobby()
    deleteSession()
    onDeleteLobby()
    removeSession.mutate(session.id)
  }
}
