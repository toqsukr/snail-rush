import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useMutation } from '@tanstack/react-query'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'

const deleteLobbyMutationKey = 'delete-lobby'

const useDeleteSession = () => {
  return useMutation({
    mutationKey: [deleteLobbyMutationKey],
    mutationFn: async (sessionID: string) => {
      return await sessionService.deleteSession(sessionID)
    },
  })
}

export const useDeleteLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { session, deleteSession } = useSession()
  const user = useUser(s => s.user)
  const { isHost, onDeleteLobby } = useMenuDeps()
  const removeSession = useDeleteSession()

  return () => {
    if (!session?.id || (user && !isHost(user.id))) return

    disconnectLobby()
    deleteSession()
    onDeleteLobby()
    removeSession.mutate(session.id)
  }
}
