import { PlayerDTO } from '@shared/api/player'
import { TPlayer } from '../model/types'

export const parseFromPlayerDTO = (playerDTO: PlayerDTO) => {
  const { player_id, skin_id, total_games, is_ready, ...rest } = playerDTO

  const player: TPlayer = {
    id: player_id,
    skinID: skin_id,
    totalGames: total_games,
    isReady: is_ready,
    ...rest,
  }

  return player
}
