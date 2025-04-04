import { concatMap, Subject } from 'rxjs'
import { RotationType } from './types'

export const useAppendRotation = () => {
  const $rotationStream = new Subject<RotationType>()

  const sequentialRotation = $rotationStream.pipe(
    concatMap(data => {
      return new Promise<RotationType>(resolve => {
        resolve(data)
      })
    })
  )

  const appendRotation = (data: RotationType) => {
    $rotationStream.next(data)
  }

  return { sequentialRotation, appendRotation }
}
