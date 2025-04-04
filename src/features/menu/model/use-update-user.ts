import { TUser, useUser } from '@entities/user'
import playerService, { PlayerDTO } from '@shared/api/player'
import { useMutation } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'

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
  const { user, updateUser } = useUser()

  const debouncedUpdateUser = useCallback(
    debounce((user: TUser) => {
      updatePlayer.mutate({ player_id: user.id, username: user.username })
    }, 1500),
    []
  )

  return (username: string) => {
    if (!user) return

    const updatedUser = { id: user.id, username }

    updateUser(updatedUser)
    debouncedUpdateUser(updatedUser)
  }
}
