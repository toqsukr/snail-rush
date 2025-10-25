import { Emitter } from '@shared/lib/emitter'
import { PositionType } from './types'

export const playerPositionEmitter = new Emitter<PositionType>()

export const pushPlayerPosition = (data: PositionType) => {
  playerPositionEmitter.emitNextValue(data)
}
