import { parseFromPlayerDTO, usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useConnectSession } from '../api/connect-session'
import { useMainMenuDeps } from '../deps'
import { useMenu } from './store'

export const useConnectLobby = () => {
  const updateSession = useSession(s => s.updateSession)
  const { data: user } = useUser()
  const updatePlayers = usePlayers(s => s.updatePlayers)
  const connectSession = useConnectSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { onConnectLobby } = useMainMenuDeps()

  return async (sessionID: string) => {
    if (!user?.id) return

    const session = await connectSession.mutateAsync({ sessionID, playerID: user.id })
    connectLobby()
    onConnectLobby(user.id, session.session_id)
    updateSession(parseFromSessionDTO(session))
    updatePlayers(session.players.map(player => parseFromPlayerDTO(player)))
  }
}
