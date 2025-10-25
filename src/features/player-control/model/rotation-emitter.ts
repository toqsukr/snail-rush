import { Emitter } from '@shared/lib/emitter'
import { RotationType } from './types'

export const playerRotationEmitter = new Emitter<RotationType>()

export const pushPlayerRotation = (data: RotationType) => {
  playerRotationEmitter.emitNextValue(data)
}
