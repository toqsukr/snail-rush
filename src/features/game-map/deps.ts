import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { ReactNode } from 'react'

type GameMapDeps = {
  renderMapView: ReactNode
  renderObstacles: ReactNode[]
  renderStartLine: ReactNode
  renderFinishLine: ReactNode
}

export const gameMapDepsContext = createStrictContext<GameMapDeps>()

export const useGameMapDeps = () => useStrictContext(gameMapDepsContext)
