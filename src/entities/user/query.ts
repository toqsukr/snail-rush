import authService from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { useToken } from '@shared/config/token'
import { useQuery } from '@tanstack/react-query'
import { TUser } from './model/types'

const userDataQueryKey = 'get-user-data'

export const useUser = () => {
  const token = useToken(s => s.token)
  return useQuery({
    queryKey: [userDataQueryKey],
    queryFn: () => {
      return authService.getUserByToken()
    },
    select: ({ player_id, skin_id, ...rest }) => {
      return { ...rest, id: player_id, skinID: skin_id } satisfies Omit<TUser, 'token'>
    },
    enabled: !!token,
  })
}

export const invalidateUser = () => queryClient.invalidateQueries({ queryKey: [userDataQueryKey] })
