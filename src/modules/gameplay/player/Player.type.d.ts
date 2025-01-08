import { PlayerStatus } from '@modules/lobby/type'
import { SnailJumpProp } from '../snail-jump/SnailJump.type.d'

export type PlayerProp = SnailJumpProp & {
  status: PlayerStatus
}
