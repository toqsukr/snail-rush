import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { Vector3 } from 'three'
import { PositionType, RotationType } from './model/types'

type PlayerDeps = {
  onJump: (position: PositionType) => void
  onRotate: (rotation: RotationType) => void
  getRotation: () => number[]
  calcAnimationDuration: (koef: number) => number
  calcTargetPosition: (koef: number) => Vector3
  isMoveable: boolean
  isJumping: boolean
}

export const playerDepsContext = createStrictContext<PlayerDeps>()

export const usePlayerDeps = () => useStrictContext(playerDepsContext)
