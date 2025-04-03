import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { Vector3 } from 'three'
import { PositionType, RotationType } from './model/types'

type PlayerDeps = {
  getMoveable: () => boolean
  getRotation: () => number[]
  getIsAnimating: () => boolean
  onJump: (position: PositionType) => void
  onRotate: (rotation: RotationType) => void
  calcTargetPosition: (koef: number) => Vector3
  calcAnimationDuration: (koef: number) => number
}

export const playerDepsContext = createStrictContext<PlayerDeps>()

export const usePlayerDeps = () => useStrictContext(playerDepsContext)
