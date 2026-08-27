import debounce from 'lodash.debounce'
import { invalidatePlayerByID } from '@entities/players'
import { invalidateUser, TUser } from '@entities/user'
import playerService from '@shared/api/player'

const RENAME_DELAY = 1500

const pending = debounce(async ({ id, username, skinID }: TUser) => {
  await playerService.updatePlayer({ player_id: id, username, skin_id: skinID })
  await Promise.all([invalidateUser(), invalidatePlayerByID(id)])
}, RENAME_DELAY)

export const rename = (user: TUser) => {
  pending(user)
}

export const flushRename = async () => {
  await pending.flush()
}
