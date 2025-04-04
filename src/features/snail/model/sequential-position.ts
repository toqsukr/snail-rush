import { concatMap, Subject } from 'rxjs'
import { PositionType } from './types'

export const useAppendPosition = () => {
  const $positionStream = new Subject<PositionType>()

  const sequentialPosition = $positionStream.pipe(
    concatMap(data => {
      return new Promise<PositionType>(resolve => {
        resolve(data)
      })
    })
  )

  const appendPosition = (data: PositionType) => {
    $positionStream.next(data)
  }

  return { appendPosition, sequentialPosition }
}
