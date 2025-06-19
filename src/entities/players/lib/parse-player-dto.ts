import { PlayerDTO } from '@shared/api/player'
import { TPlayer } from '../model/types'

export const parseFromPlayerDTO = (playerDTO: PlayerDTO) => {
  const { player_id, skin_id, total_games, ...rest } = playerDTO

  const player: TPlayer = {
    id: player_id,
    skinID: skin_id,
    totalGames: total_games,
    ...rest,
  }

  return player
}
