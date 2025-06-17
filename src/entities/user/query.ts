import authService from '@shared/api/auth'
import { useQuery } from '@tanstack/react-query'
import { TUser } from './model/types'

const userDataQueryKey = 'get-user-data'

export const useSkins = () => {
  return useQuery({
    queryKey: [userDataQueryKey],
    queryFn: () => {
      return authService.getUserByToken()
    },
    select: ({ player_id, skin_id, ...rest }) => {
      return { ...rest, id: player_id, skinID: skin_id } satisfies Omit<TUser, 'token'>
    },
    // enabled: sessionStorage.getItem('')
  })
}
