import playerService from '@shared/api/player'
import { queryClient } from '@shared/api/query-client'
import { useToken } from '@shared/config/token'
import { useQuery } from '@tanstack/react-query'
import { TPlayer } from './model/types'

const playerByIDQueryKey = 'get-player-by-id'

export const usePlayerByID = (id: string) => {
  const token = useToken(s => s.token)
  return useQuery({
    queryKey: [playerByIDQueryKey, id],
    queryFn: () => {
      return playerService.getPlayer(id)
    },
    select: ({ player_id, skin_id, total_games, is_ready, ...rest }) => {
      return {
        ...rest,
        id: player_id,
        skinID: skin_id,
        isReady: is_ready,
        totalGames: total_games,
      } satisfies TPlayer
    },
    enabled: !!token && !!id,
  })
}

export const invalidatePlayerByID = (id: string) =>
  queryClient.invalidateQueries({ queryKey: [playerByIDQueryKey, id] })
