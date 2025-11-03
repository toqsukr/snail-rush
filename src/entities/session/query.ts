import { queryClient } from '@shared/api/query-client'
import sessionService from '@shared/api/session'
import { useToken } from '@shared/config/token'
import { useQuery } from '@tanstack/react-query'
import { useSessionCode } from './model/store'
import { TSession } from './model/types'

const sessionDataQueryKey = 'get-session-data'

export const useSession = () => {
  const code = useSessionCode(s => s.code)
  const token = useToken(s => s.token)
  return useQuery({
    queryKey: [sessionDataQueryKey],
    queryFn: () => {
      return sessionService.getSession(code ?? '')
    },
    select: ({ host_id, is_active, players, score }) => {
      return {
        score,
        id: code ?? '',
        hostID: host_id,
        isActive: is_active,
        players: players.map(({ player_id, is_ready }) => ({ id: player_id, isReady: is_ready })),
      } satisfies TSession
    },
    enabled: !!token && !!code,
  })
}

export const invalidateSession = () =>
  queryClient.invalidateQueries({ queryKey: [sessionDataQueryKey] })

export const resetSession = () => {
  queryClient.removeQueries({ queryKey: [sessionDataQueryKey] })
}
