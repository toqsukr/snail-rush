import playerService from '@shared/api/player'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const createPlayerMutationKey = 'create-player'

export const useCreatePlayer = () => {
  return useMutation({
    mutationKey: [createPlayerMutationKey],
    mutationFn: async (username: string) => {
      return playerService.createPlayer(username)
    },
  })
}

export const useIsUserCreating = () => {
  return !!useIsMutating({ mutationKey: [createPlayerMutationKey] })
}
