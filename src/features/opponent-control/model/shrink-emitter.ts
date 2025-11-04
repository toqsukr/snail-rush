import { Emitter } from '@shared/lib/emitter'
import { ShrinkType } from './types'

export const opponentShrinkEmitter = new Emitter<ShrinkType>()

export const pushOpponentShrink = (data: ShrinkType) => {
  opponentShrinkEmitter.emitNextValue(data)
}
