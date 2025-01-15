import { opponentPositionStream } from '../store'
import { OpponentPositionType } from '../type'

export const appendOpponentPosition = (data: OpponentPositionType) => {
  opponentPositionStream.next(data)
}
