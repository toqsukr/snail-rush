import { PlayerStatus } from '@modules/lobby/type'
import { ObjectMap } from '@react-three/fiber'
import { Euler, Quaternion, Vector3 } from 'three'
import { GLTF } from 'three-stdlib'
import {
  HOST_START_POSITION,
  JOINED_START_POSITION,
  MAX_ANIMATION_DURATION,
  MAX_JUMP_LENGTH,
  MIN_ANIMATION_DURATION,
  MIN_JUMP_LENGTH,
} from './constant'

export const getStartPosition = (status: PlayerStatus, mode: PlayerStatus) => {
  const definePosition = {
    host: {
      host: HOST_START_POSITION,
      joined: JOINED_START_POSITION,
    },
    joined: {
      host: JOINED_START_POSITION,
      joined: HOST_START_POSITION,
    },
  }

  return definePosition[mode][status]
}

export const getModel = (
  mode: PlayerStatus,
  status: PlayerStatus,
  playerModel: GLTF & ObjectMap,
  opponentModel: GLTF & ObjectMap
) => {
  const defineModel = {
    host: {
      host: playerModel,
      joined: opponentModel,
    },
    joined: {
      host: opponentModel,
      joined: playerModel,
    },
  }

  return defineModel[mode][status]
}

export const calcJumpDistance = (koef: number) => {
  return Math.max(MIN_JUMP_LENGTH, koef * MAX_JUMP_LENGTH)
}

export const calcIntermediatePosition = (start: number[], end: number[]) => {
  const deltaZ = end[2] - start[2]
  return [end[0], end[1] + 1.5, end[2] - deltaZ / 2]
}

export const calcAnimationDuration = (duration: number, koef: number) => {
  return Math.min(Math.max(MIN_ANIMATION_DURATION, koef * duration), MAX_ANIMATION_DURATION)
}

export const calculateLandingPosition = (position: Vector3, rotation: Euler, distance: number) => {
  const localDirection = new Vector3(0, 0, -1)

  const quaternion = new Quaternion().setFromEuler(rotation)

  localDirection.applyQuaternion(quaternion)

  const newPosition = position.clone().addScaledVector(localDirection, distance)

  return newPosition
}
