import { Euler, Vector3 } from 'three'
import { useSnailParams } from './params'

export const calculateImpulse = (rotation: Euler, koef: number) => {
  return new Vector3(0, 0, koef)
    .applyEuler(rotation)
    .multiplyScalar(useSnailParams.getState().impulseMultiplier)
}
