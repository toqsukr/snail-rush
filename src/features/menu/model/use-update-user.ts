import { TUser, useUser } from '@entities/user'
import playerService, { PlayerDTO } from '@shared/api/player'
import { useMutation } from '@tanstack/react-query'
import debounce from 'lodash.debounce'

const updateUserMutationKey = 'update-user'

const useUpdatePlayer = () => {
  return useMutation({
    mutationKey: [updateUserMutationKey],
    mutationFn: async (data: PlayerDTO) => {
      return playerService.updatePlayer(data)
    },
  })
}

export const useUpdateUser = () => {
  const updatePlayer = useUpdatePlayer()
  const user = useUser(s => s.user)

  const debouncedUpdateUser = debounce((user: TUser, username: string) => {
    updatePlayer.mutate({ player_id: user.id, username })
  }, 1500)

  return (username: string) => {
    if (!user) return

    debouncedUpdateUser(user, username)
  }
}
