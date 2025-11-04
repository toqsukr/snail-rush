import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { Euler, Vector3 } from 'three'

type PlayerDeps = {
  canMove: () => boolean
  onJump: (
    koef: number,
    holdTime: number,
    callback: (impulse: Vector3, duration: number) => void
  ) => void
  onRotate: (
    pitchIncrement: number,
    callback: (updatedRotation: Euler, duration: number) => void
  ) => void
  onStartShrink?: () => void
  onStopShrink?: () => void
}

export const playerDepsContext = createStrictContext<PlayerDeps>()

export const usePlayerDeps = () => useStrictContext(playerDepsContext)
