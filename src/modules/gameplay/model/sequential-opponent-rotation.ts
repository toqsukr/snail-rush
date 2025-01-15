import { concatMap } from 'rxjs'
import { opponentRotationStream } from '../store'
import { OpponentRotationType } from '../type'

export const sequentialOpponentRotation = opponentRotationStream.pipe(
  concatMap(data => {
    return new Promise<OpponentRotationType>(resolve => {
      setTimeout(() => resolve(data), 0)
    })
  })
)
