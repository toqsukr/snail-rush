import { usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { parseFromPlayerDTO } from '@entities/user'
import { useCreateSession } from '../api/create-session'
import { useMainMenuDeps } from '../deps'
import { useMenu } from './store'
import { useCreateUser } from './use-create-user'

export const useCreateLobby = () => {
  const createSession = useCreateSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { session, updateSession } = useSession()
  const createUser = useCreateUser()
  const updatePlayers = usePlayers(s => s.updatePlayers)
  const { onCreateLobby } = useMainMenuDeps()

  return async (username: string) => {
    connectLobby()

    if (session) return

    const user = await createUser(username)
    const createdSession = await createSession.mutateAsync(user.id)
    onCreateLobby(user.id, createdSession.session_id)
    updatePlayers(createdSession.players.map(player => parseFromPlayerDTO(player)))
    updateSession(parseFromSessionDTO(createdSession))
  }
}
