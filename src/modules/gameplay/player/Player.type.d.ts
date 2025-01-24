import { PlayerStatus } from '@modules/lobby/type'
import { PlayerData } from '@modules/player/type'

export type PlayerProp = {
  mode: PlayerStatus
  playerID: PlayerData['player_id']
}
