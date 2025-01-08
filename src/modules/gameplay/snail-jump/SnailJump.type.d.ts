import { PlayerStatus } from '@modules/lobby/type'

export type SnailJumpProp = {
  updateCameraPosition: () => void
  status: PlayerStatus
}
