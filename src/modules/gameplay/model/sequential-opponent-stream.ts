import { concatMap } from 'rxjs'
import { opponentStream } from '../store'
import { OpponentStreamType } from '../type'

export const sequentialOpponentStream = opponentStream.pipe(
  concatMap(data => {
    return new Promise<OpponentStreamType>(resolve => {
      setTimeout(() => resolve(data), data.duration * 1000 + data.holdTime)
    })
  })
)
