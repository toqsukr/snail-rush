import { TUser } from '@entities/user'
import { PlayerDTO } from '@shared/api/player'

export const parseFromPlayerDTO = (player: PlayerDTO) => {
  const { player_id, username } = player

  const user: TUser = {
    id: player_id,
    username,
  }

  return user
}
