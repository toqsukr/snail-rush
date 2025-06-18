import { parseFromPlayerDTO, usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useCreateSession } from '../api/create-session'
import { useMainMenuDeps } from '../deps'
import { useMenu } from './store'

export const useCreateLobby = () => {
  const createSession = useCreateSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { data: user } = useUser()
  const { session, updateSession } = useSession()
  const updatePlayers = usePlayers(s => s.updatePlayers)
  const { onCreateLobby } = useMainMenuDeps()

  return async () => {
    if (!user) return

    if (session) {
      connectLobby()
    } else {
      const createdSession = await createSession.mutateAsync(user.id)
      connectLobby()

      onCreateLobby(user.id, createdSession.session_id)
      updatePlayers(createdSession.players.map(player => parseFromPlayerDTO(player)))
      updateSession(parseFromSessionDTO(createdSession))
    }
  }
}
