import { useUser } from '@entities/user'
import { rename } from './rename'

export const useUpdateUsername = () => {
  const { data: user } = useUser()

  return (username: string) => {
    if (!user) return
    rename({ ...user, username })
  }
}
