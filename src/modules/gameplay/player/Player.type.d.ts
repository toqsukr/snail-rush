import { PlayerStatus } from '@modules/lobby/type'
import { PlayerData } from '@modules/player/type'
import { Vector3 } from 'three'

export type PlayerProp = {
  updateCameraPosition: (targetPosition: Vector3) => void
  mode: PlayerStatus
  playerID: PlayerData['player_id']
}
