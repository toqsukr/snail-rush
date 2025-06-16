import { TUser, useUser } from '@entities/user'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useUpdatePlayer } from '../api/update-user'

export const useUpdateUsername = () => {
  const updatePlayer = useUpdatePlayer()
  const { user, updateUser } = useUser()

  const debouncedUpdateUser = useCallback(
    debounce((user: TUser) => {
      updatePlayer.mutate(user)
    }, 1500),
    []
  )

  return (username: string) => {
    if (!user) return

    const updatedUser = { ...user, username }

    updateUser(updatedUser)
    debouncedUpdateUser(updatedUser)
  }
}
