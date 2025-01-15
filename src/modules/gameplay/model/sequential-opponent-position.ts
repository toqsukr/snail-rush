import { concatMap } from 'rxjs'
import { opponentPositionStream } from '../store'
import { OpponentPositionType } from '../type'

export const sequentialOpponentPosition = opponentPositionStream.pipe(
  concatMap(data => {
    return new Promise<OpponentPositionType>(resolve => {
      resolve(data)
    })
  })
)
