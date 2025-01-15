import { opponentRotationStream } from '../store'
import { OpponentRotationType } from '../type'

export const appendOpponentRotation = (data: OpponentRotationType) => {
  opponentRotationStream.next(data)
}
