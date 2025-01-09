import { concatMap } from 'rxjs'
import { opponentStream } from '../store'
import { OpponentStreamType } from '../type'

export const sequentialPositionStream = opponentStream.pipe(
  concatMap(point => {
    return new Promise<OpponentStreamType>(resolve => {
      setTimeout(() => resolve(point), 300)
    })
  })
)
