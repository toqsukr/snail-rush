import playerService from '@shared/api/player'
import { TPlayer } from './types'

export const getPlayer = async (id: string) => {
  return playerService
    .getPlayer(id)
    .then(({ is_ready, player_id, skin_id, total_games, ...rest }) => ({
      ...rest,
      id: player_id,
      isReady: is_ready,
      skinID: skin_id,
      totalGames: total_games,
    })) satisfies Promise<TPlayer>
}
