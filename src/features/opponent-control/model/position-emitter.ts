import { Emitter } from '@shared/lib/emitter'
import { PositionType } from './types'

export const opponentPositionEmitter = new Emitter<PositionType>()

export const pushOpponentPosition = (data: PositionType) => {
  opponentPositionEmitter.emitNextValue(data)
}
