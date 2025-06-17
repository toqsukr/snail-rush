import { TUser } from '@entities/user'
import { PlayerDTO } from '@shared/api/player'

export const parseFromRegisterDTO = (userData: PlayerDTO) => {
  const { player_id, skin_id, ...rest } = userData

  const user: Omit<TUser, 'token'> = {
    id: player_id,
    skinID: skin_id,
    ...rest,
  }

  return user
}
