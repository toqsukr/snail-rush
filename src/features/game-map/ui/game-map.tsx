import { useGameMapDeps } from '../deps'
import FinishLine from './finish-line'

export const GameMap = () => {
  const { renderMapView, renderStartLine, renderObstacles } = useGameMapDeps()

  return (
    <>
      {renderMapView}
      {renderStartLine}
      {...renderObstacles}
      <FinishLine />
    </>
  )
}
