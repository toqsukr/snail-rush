import { concatMap, Subject } from 'rxjs'
import { RotationType } from './types'

export const $rotationStream = new Subject<RotationType>()

export const sequentialRotation = $rotationStream.pipe(
  concatMap(data => {
    return new Promise<RotationType>(resolve => {
      resolve(data)
    })
  })
)

export const appendRotation = (data: RotationType) => {
  $rotationStream.next(data)
}
