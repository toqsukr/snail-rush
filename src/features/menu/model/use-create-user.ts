import { parseFromPlayerDTO, useUser } from '@entities/user'
import { useCreatePlayer } from '../api/create-user'

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
