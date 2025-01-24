import { PositionType } from '@modules/app/type'
import { PlayerStatus } from '@modules/lobby/type'
import { Euler, Quaternion, Vector3 } from 'three'
import {
  HOST_START_POSITION,
  JOINED_START_POSITION,
  MAX_ANIMATION_DURATION,
  MAX_JUMP_LENGTH,
  MIN_ANIMATION_DURATION,
  MIN_JUMP_LENGTH,
} from './constant'
import { PlayerPositions, PlayerSkins } from './type.d'

export const getStartPosition = (playerPosition: PlayerPositions) => {
  const definePosition: Record<PlayerPositions, PositionType> = {
    0: HOST_START_POSITION,
    1: JOINED_START_POSITION,
  }
  return definePosition[playerPosition]
}

export const getModelPath = (skin: PlayerSkins) => {
  const defineModelPath: Record<PlayerSkins, string> = {
    herbivore: '/animations/full-jump-static-light.glb',
    predator: '/animations/full-jump-static-opponent.glb',
  }
  return defineModelPath[skin]
}

export const getPlayerPosition = (status: PlayerStatus) => {
  const definePlayerPosition: Record<PlayerStatus, PlayerPositions> = {
    host: PlayerPositions.FIRST,
    joined: PlayerPositions.SECOND,
  }
  return definePlayerPosition[status]
}

export const getPlayerSkin = (status: PlayerStatus) => {
  const definePlayerPosition: Record<PlayerStatus, PlayerSkins> = {
    host: PlayerSkins.HERBIVORE,
    joined: PlayerSkins.PREDATOR,
  }
  return definePlayerPosition[status]
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
