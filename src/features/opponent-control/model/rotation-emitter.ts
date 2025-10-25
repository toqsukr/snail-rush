import { Emitter } from '@shared/lib/emitter'
import { RotationType } from './types'

export const opponentRotationEmitter = new Emitter<RotationType>()

export const pushOpponentRotation = (data: RotationType) => {
  opponentRotationEmitter.emitNextValue(data)
}
