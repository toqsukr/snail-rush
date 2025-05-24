import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'

const disconnectLobbyMutationKey = 'disconnect-lobby'

export const useDisconnect = () => {
  return useMutation({
    mutationKey: [disconnectLobbyMutationKey],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return await sessionService.kickPlayer(data.sessionID, data.playerID, data.playerID)
    },
  })
}

export const useDisconnectLobby = () => {
  const disconnectLobby = useMenu(s => s.disconnectLobby)
  const { session, deleteSession } = useSession()
  const disconnectYourself = useDisconnect()
  const user = useUser(s => s.user)
  const { onDisconnectLobby } = useMenuDeps()

  return async () => {
    if (!user || !session) return

    disconnectLobby()
    await disconnectYourself.mutateAsync({ sessionID: session.id, playerID: user.id })
    deleteSession() // ?
    onDisconnectLobby()
  }
}

export const useIsDisconnectingLobby = () => {
  return !!useIsMutating({ mutationKey: [disconnectLobbyMutationKey] })
}
