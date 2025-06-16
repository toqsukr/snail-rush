import { TUser } from '@entities/user'
import { RegisterDTO } from '@shared/api/auth'

export const parseFromRegisterDTO = (userData: RegisterDTO) => {
  const { player_id, total_games, skin_id, ...rest } = userData.player
  const { access_token } = userData.token

  const user: TUser = {
    id: player_id,
    totalGames: total_games,
    skinID: skin_id,
    token: access_token,
    ...rest,
  }

  return user
}
