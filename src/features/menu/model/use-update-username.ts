import { invalidateUser, TUser, useUser } from '@entities/user'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useUpdatePlayer } from '../api/update-user'

export const useUpdateUsername = () => {
  const updatePlayer = useUpdatePlayer()
  const { data: user } = useUser()

  const debouncedUpdateUser = useCallback(
    debounce((user: TUser) => {
      return updatePlayer.mutateAsync(user)
    }, 1500),
    []
  )

  return async (username: string) => {
    if (!user) return

    const updatedUser = { ...user, username }

    await debouncedUpdateUser(updatedUser)
    invalidateUser()
  }
}
