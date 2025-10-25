import { Euler, Vector3 } from 'three'

export type PositionType = {
  impulse: Vector3
  holdTime: number
  duration: number
}

export type RotationType = {
  rotation: Euler
  duration: number
}
