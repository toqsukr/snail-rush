import { usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { parseFromPlayerDTO } from '@entities/user'
import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'
import { useCreateUser, useIsUserCreating } from './use-create-user'

const createSessionMutationKey = 'create-session'

const useCreateSession = () => {
  return useMutation({
    mutationKey: [createSessionMutationKey],
    mutationFn: async (playerID: string) => {
      return await sessionService.createSession(playerID)
    },
  })
}

export const useCreateLobby = () => {
  const createSession = useCreateSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { session, updateSession } = useSession()
  const createUser = useCreateUser()
  const updatePlayers = usePlayers(s => s.updatePlayers)
  const { onCreateLobby } = useMenuDeps()

  return async (username: string) => {
    connectLobby()

    if (session) return

    const user = await createUser(username)
    const createdSession = await createSession.mutateAsync(user.id)
    onCreateLobby()
    updatePlayers(createdSession.players.map(player => parseFromPlayerDTO(player)))
    updateSession(parseFromSessionDTO(createdSession))
  }
}

export const useIsLobbyCreating = () => {
  const isUserCreating = useIsUserCreating()
  return !!useIsMutating({ mutationKey: [createSessionMutationKey] }) || isUserCreating
}
