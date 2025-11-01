import { Euler, Vector3 } from 'three'
import { IMPULSE_MULTIPLIER } from './constants'

export const calculateImpulse = (rotation: Euler, koef: number) => {
  return new Vector3(0, 0, koef).applyEuler(rotation).multiplyScalar(IMPULSE_MULTIPLIER)
}