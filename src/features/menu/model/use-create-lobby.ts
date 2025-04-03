import { parseFromSessionDTO, useSession } from '@entities/session'
import { parseFromPlayerDTO } from '@entities/user'
import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { useMenu } from './store'
import { useCreateUser, useIsUserCreating } from './use-create-user'
import { useUpdateLobbyPlayers } from './use-update-lobby-players'

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
  const updateSession = useSession(s => s.updateSession)
  const updateLobbyPlayers = useUpdateLobbyPlayers()
  const createUser = useCreateUser()

  return async (username: string) => {
    connectLobby()
    const user = await createUser(username)
    const session = await createSession.mutateAsync(user.id)
    updateLobbyPlayers(session.players.map(player => parseFromPlayerDTO(player)))
    updateSession(parseFromSessionDTO(session))
  }
}

export const useIsLobbyCreating = () => {
  const isUserCreating = useIsUserCreating()
  return !!useIsMutating({ mutationKey: [createSessionMutationKey] }) || isUserCreating
}
