import { opponentStream } from '../store'
import { OpponentStreamType } from '../type'

export const appendOpponentData = (data: OpponentStreamType) => {
  opponentStream.next(data)
}
