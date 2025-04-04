import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { PositionType, RotationType } from './model/types'

type OpponentDeps = {
  onJump: (position: PositionType) => void
  onRotate: (rotation: RotationType) => void
}

export const opponentDepsContext = createStrictContext<OpponentDeps>()

export const useOpponentDeps = () => useStrictContext(opponentDepsContext)
