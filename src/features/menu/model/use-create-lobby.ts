import { useSession } from '@entities/session'
import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { parseFromSessionDTO } from '../lib/parse-session-dto'
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
  const updateSession = useSession(s => s.updateSession)
  const createUser = useCreateUser()

  return async (username: string) => {
    connectLobby()
    const user = await createUser(username)
    const session = await createSession.mutateAsync(user.id)
    updateSession(parseFromSessionDTO(session))
  }
}

export const useIsLobbyCreating = () => {
  const isUserCreating = useIsUserCreating()
  return !!useIsMutating({ mutationKey: [createSessionMutationKey] }) || isUserCreating
}
