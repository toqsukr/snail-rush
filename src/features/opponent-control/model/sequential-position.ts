import { concatMap, Subject } from 'rxjs'
import { PositionType } from './types'

export const $positionStream = new Subject<PositionType>()

export const sequentialPosition = $positionStream.pipe(
  concatMap(data => {
    return new Promise<PositionType>(resolve => {
      resolve(data)
    })
  })
)

export const pushOpponentPosition = (data: PositionType) => {
  $positionStream.next(data)
}
