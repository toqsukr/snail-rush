import { GameMap, gameMapDepsContext } from '@features/game-map'
import { StaticObstacle } from '@features/obstacle'
import FinishLine from '@shared/primitives/finish-line'
import GrassMap from '@shared/primitives/maps/grass-map'
import Stone from '@shared/primitives/obstacles/stone'
import StartLine from '@shared/primitives/start-line'
import { Vector3 } from 'three'

export const stones = [
  [-3, 0, 13],
  [5, 0, 18],
  [0, 0, 25],
  [8, 0, 30],
  [-4, 0, 33],
  [5, 0, 40],
  [-10, 0, 48],
  [5, 0, 55],
  [-25, 0, 60],
  [-43, 0, 58],
  [-38, 0, 47],
  [-49, 0, 43],
  [-45, 0, 33],
  [-48, 0, 25],
  [-56, 0, 18],
  [-46, 0, 13],
]

const startProps = {
  position: [3, 0.1, 4],
  rotation: [0, Math.PI / 2, 0],
}

const finishProps = {
  position: [-35, 0.1, -4],
  rotation: [0, Math.PI / 2.8, 0],
}

const GameMapWithDeps = () => {
  return (
    <gameMapDepsContext.Provider
      value={{
        renderMapView: <GrassMap />,
        renderStartLine: <StartLine {...startProps} />,
        renderFinishLine: <FinishLine {...finishProps} />,
        renderObstacles: stones.map(position => (
          <StaticObstacle model={<Stone />} position={new Vector3(...position)} />
        )),
      }}>
      <GameMap />
    </gameMapDepsContext.Provider>
  )
}

export default GameMapWithDeps
