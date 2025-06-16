import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import { useIsUserCreating } from './create-user'

const createSessionMutationKey = 'create-session'

export const useCreateSession = () => {
  return useMutation({
    mutationKey: [createSessionMutationKey],
    mutationFn: async (playerID: string) => {
      return await sessionService.createSession(playerID)
    },
  })
}

export const useIsLobbyCreating = () => {
  const isUserCreating = useIsUserCreating()
  return !!useIsMutating({ mutationKey: [createSessionMutationKey] }) || isUserCreating
}
