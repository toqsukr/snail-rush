import { TUser } from '@entities/user'
import { PlayerDTO } from '@shared/api/player'

export const parseFromRegisterDTO = (userData: PlayerDTO) => {
  const { player_id, skin_id, total_games, is_ready, ...rest } = userData

  const user: TUser = {
    id: player_id,
    skinID: skin_id,
    totalGames: total_games,
    isReady: is_ready,
    ...rest,
  }

  return user
}
