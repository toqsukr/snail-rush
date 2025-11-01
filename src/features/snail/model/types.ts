import { Euler, Vector3 } from 'three'

export type PositionType = {
  impulse: Vector3
  holdTime: number
  duration: number
}

export type PositionWithCorrectType = {
  correctStartPosition: true
  startPosition: Vector3
} & PositionType

export type PositionWithoutCorrectType = {
  correctStartPosition?: false
  startPosition?: never
} & PositionType

export type RotationType = {
  rotation: Euler
  duration: number
}
