import { parseFromPlayerDTO, useUser } from '@entities/user'
import playerService from '@shared/api/player'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const createPlayerMutationKey = 'create-player'

const useCreatePlayer = () => {
  return useMutation({
    mutationKey: [createPlayerMutationKey],
    mutationFn: async (username: string) => {
      return playerService.createPlayer(username)
    },
  })
}

export const useCreateUser = () => {
  const createPlayer = useCreatePlayer()
  const { user, updateUser } = useUser()

  return async (username: string) => {
    if (user) return user

    const player = await createPlayer.mutateAsync(username)
    const parsedUser = parseFromPlayerDTO(player)
    updateUser(parsedUser)
    return parsedUser
  }
}

export const useIsUserCreating = () => {
  return !!useIsMutating({ mutationKey: [createPlayerMutationKey] })
}
