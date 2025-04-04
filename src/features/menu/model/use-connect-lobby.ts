import { usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { parseFromPlayerDTO, useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'

const connectSessionMutationKey = 'connect-session'

const useConnectSession = () => {
  return useMutation({
    mutationKey: [connectSessionMutationKey],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return await sessionService.connectSession(data.sessionID, data.playerID)
    },
  })
}

export const useConnectLobby = () => {
  const updateSession = useSession(s => s.updateSession)
  const user = useUser(s => s.user)
  const updatePlayers = usePlayers(s => s.updatePlayers)
  const connectSession = useConnectSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { onConnectLobby } = useMenuDeps()

  return async (sessionID: string) => {
    if (!user?.id) return

    connectLobby()
    const session = await connectSession.mutateAsync({ sessionID, playerID: user.id })
    onConnectLobby()
    updateSession(parseFromSessionDTO(session))
    updatePlayers(session.players.map(player => parseFromPlayerDTO(player)))
  }
}

export const useIsConnectingLobby = () => {
  return !!useIsMutating({ mutationKey: [connectSessionMutationKey] })
}
