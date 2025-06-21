import { resetSession, useSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import { useDeleteSession } from '../api/delete-session'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useDeleteLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { data: session } = useSession()
  const deleteSession = useSessionCode(s => s.deleteSession)
  const { data: user } = useUser()
  const { isHost, onDeleteLobby } = useLobbyMenuDeps()
  const removeSession = useDeleteSession()

  return () => {
    if (!session?.id || (user && !isHost(user.id))) return

    disconnectLobby()
    deleteSession()
    resetSession()
    onDeleteLobby()
    removeSession.mutate(session.id)
  }
}
