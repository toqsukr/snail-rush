import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import { invalidateUser, TUser, useUser } from '@entities/user'
import { useUpdatePlayer } from '../api/update-user'

export const useUpdateUsername = () => {
  const updatePlayer = useUpdatePlayer()
  const { data: user } = useUser()

  const debouncedUpdateUser = useCallback(
    debounce(async (user: TUser) => {
      await updatePlayer.mutateAsync(user)
      invalidateUser()
    }, 1500),
    [],
  )

  return async (username: string) => {
    if (!user) return

    const updatedUser = { ...user, username }

    debouncedUpdateUser(updatedUser)
  }
}
