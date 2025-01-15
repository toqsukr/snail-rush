import { concatMap } from 'rxjs'
import { opponentPositionStream } from '../store'
import { OpponentPositionType } from '../type'

export const sequentialOpponentPosition = opponentPositionStream.pipe(
  concatMap(data => {
    return new Promise<OpponentPositionType>(resolve => {
      const { position } = data
      const timeout = position.duration * 1000 + position.hold_time
      setTimeout(() => resolve(data), 0)
    })
  })
)
