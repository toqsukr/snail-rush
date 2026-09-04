import { Emitter } from '@shared/lib/emitter'
import { SnapshotType } from './types'

export const opponentSnapshotEmitter = new Emitter<SnapshotType>()

export const pushOpponentSnapshot = (data: SnapshotType) => {
  opponentSnapshotEmitter.emitNextValue(data)
}
