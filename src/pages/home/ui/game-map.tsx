import { FinishControl, finishControlDepsContext } from '@features/finish-control'
import { StaticObstacle } from '@features/obstacle'
import FinishLine from '@shared/primitives/finish-line'
import GrassMap from '@shared/primitives/maps/grass-map'
import Stone from '@shared/primitives/obstacles/stone'
import StartLine from '@shared/primitives/start-line'
import { Euler, Vector3 } from 'three'
import { useGameStore } from '../model/store'

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
  position: new Vector3(-35, 0.1, -4),
  rotation: new Euler(0, Math.PI / 2.8, 0),
}

const GameMap = () => {
  const finishGame = useGameStore(s => s.finishGame)
  return (
    <>
      <GrassMap />
      <StartLine {...startProps} />
      <finishControlDepsContext.Provider value={{ onFinish: finishGame }}>
        <FinishControl {...finishProps}>
          <FinishLine />
        </FinishControl>
      </finishControlDepsContext.Provider>
      {stones.map(position => (
        <StaticObstacle
          key={position.join()}
          model={<Stone />}
          position={new Vector3(...position)}
        />
      ))}
    </>
  )
}

export default GameMap
