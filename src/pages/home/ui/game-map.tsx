import { usePlayers } from '@entities/players'
import { FinishControl, finishControlDepsContext } from '@features/finish-control'
import { useLobbyEventsContext } from '@features/lobby-events'
import { StaticObstacle } from '@features/obstacle'
import { useTrackCameraContext } from '@features/tracking-camera'
import FinishLine from '@shared/primitives/finish-line'
import GrassMap from '@shared/primitives/maps/grass-map'
import Stone from '@shared/primitives/obstacles/stone'
import StartLine from '@shared/primitives/start-line'
import { Euler, Vector3 } from 'three'
import { useGameStore } from '../model/store'

const stones = [
  [62, 0, -19],
  [70, 0, -24],
  [65, 0, -31],
  [73, 0, -36],
  [61, 0, -39],
  [70, 0, -46],
  [55, 0, -54],
  [65, 0, -61],
  [40, 0, -66],
  [22, 0, -64],
  [27, 0, -53],
  [16, 0, -49],
  [20, 0, -39],
  [17, 0, -31],
  [12, 0, -24],
  [19, 0, -19],
]

const startProps = {
  position: [15.5, 0.1, -12],
  rotation: [0, -Math.PI / 2, 0],
}

const finishProps = {
  position: new Vector3(54, 0.1, -4),
  rotation: new Euler(0, Math.PI + Math.PI / 2.8, 0),
}

const GameMap = () => {
  const { finishGame, updateWinner } = useGameStore()
  const { followTarget } = useTrackCameraContext()
  const { sendFinishGame } = useLobbyEventsContext()
  const players = usePlayers(s => s.players)

  return (
    <>
      <GrassMap />
      <StartLine {...startProps} />
      <finishControlDepsContext.Provider
        value={{
          onFinish: async userData => {
            // TODO
            if (
              typeof userData === 'object' &&
              userData &&
              'userID' in userData &&
              typeof userData.userID === 'string'
            ) {
              sendFinishGame()
              await followTarget(new Vector3(54, 0.1, -4))
              const winner = players.find(({ id }) => id === userData.userID)
              if (winner) {
                updateWinner(winner)
              }
              finishGame()
            }
          },
        }}>
        <FinishControl {...finishProps}>
          <FinishLine />
        </FinishControl>
      </finishControlDepsContext.Provider>
      {stones.map(position => (
        <StaticObstacle
          key={`stone-${position.join()}`}
          model={<Stone />}
          position={new Vector3(...position)}
        />
      ))}
    </>
  )
}

export default GameMap
