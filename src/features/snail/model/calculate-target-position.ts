import { Euler, Quaternion, Vector3 } from 'three'

const MAX_JUMP_LENGTH = 12
const MIN_JUMP_LENGTH = 6

const calcJumpDistance = (koef: number) => {
  return Math.max(MIN_JUMP_LENGTH, koef * MAX_JUMP_LENGTH)
}

const calculateLandingPosition = (position: Vector3, rotation: Euler, distance: number) => {
  const localDirection = new Vector3(0, 0, 1)
  const quaternion = new Quaternion().setFromEuler(rotation)
  localDirection.applyQuaternion(quaternion)
  const newPosition = position.clone().addScaledVector(localDirection, distance)
  return newPosition
}

export function calculateTargetPosition(position: Vector3, rotation: Euler, koef: number) {
  const distance = calcJumpDistance(koef)
  const targetPosition = calculateLandingPosition(position, rotation, distance)
  return targetPosition
}
