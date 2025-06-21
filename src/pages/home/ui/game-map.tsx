import { getPlayer } from '@entities/players'
import { TUser } from '@entities/user'
import { FinishControl, finishControlDepsContext } from '@features/finish-control'
import { useSendFinishGame } from '@features/lobby-events'
import { StaticObstacle } from '@features/obstacle'
import { useFollowTarget } from '@features/tracking-camera'
import FinishLine from '@shared/primitives/finish-line'
import GrassMap from '@shared/primitives/maps/grass-map'
import Stone from '@shared/primitives/obstacles/stone'
import TallStone from '@shared/primitives/obstacles/tall-stone'
import StartLine from '@shared/primitives/start-line'
import { Euler, Vector3 } from 'three'
import { useGameStore } from '../model/store'

export const FINISH_POSITION = new Vector3(54, 0.5, -4)

const stones = [
  { position: [62, 0, -19], rotation: [0, 0, 0] },
  { position: [63, 0, -31], rotation: [0, Math.PI / 3, 0] },
  { position: [73, 0, -36], rotation: [0, -Math.PI / 2.5, 0] },
  { position: [61, 0, -42], rotation: [0, 0, 0] },
  { position: [70, 0, -49], rotation: [0, Math.PI / 3.5, 0] },
  { position: [57, 0, -58], rotation: [0, Math.PI / 4, 0] },
  { position: [26, 0, -68], rotation: [0, 0, 0] },
  { position: [28, 0, -60], rotation: [0, 0, 0] },
  { position: [34, 0, -53], rotation: [0, Math.PI / 4, 0] },
  { position: [15, 0, -44], rotation: [0, 0, 0] },
  { position: [11, 0, -32], rotation: [0, Math.PI / 2.5, 0] },
  { position: [20, 0, -28], rotation: [0, -Math.PI / 3, 0] },
]
const tallStones = [
  { position: [45, 0, -62], rotation: [0, 0, 0] },
  { position: [73, 0, -21], rotation: [0, Math.PI / 3, 0] },
  { position: [63, 0, -26], rotation: [0, -Math.PI / 2.5, 0] },
  { position: [15, 0, -23], rotation: [0, 0, 0] },
  { position: [65, 0, -59], rotation: [0, Math.PI / 3.5, 0] },
]

const startProps = {
  position: [15.5, 0.1, -12],
  rotation: [0, -Math.PI / 2, 0],
}

const finishProps = {
  position: FINISH_POSITION,
  rotation: new Euler(0, Math.PI + Math.PI / 2.8, 0),
}

type TUserData = {
  userID: TUser['id']
}

const containsUserdata = (userData: unknown): userData is TUserData => {
  return (
    !!userData &&
    typeof userData === 'object' &&
    'userID' in userData &&
    typeof userData.userID === 'string'
  )
}

const GameMap = () => {
  const followTarget = useFollowTarget()
  const sendFinishGame = useSendFinishGame()
  const { finishGame, updateWinner, updateMoveable, winner } = useGameStore()

  return (
    <>
      <GrassMap />
      <StartLine {...startProps} />
      <finishControlDepsContext.Provider
        value={{
          onFinish: async userData => {
            if (containsUserdata(userData) && !winner) {
              updateMoveable(false)
              console.log('send finish')
              sendFinishGame()
              await followTarget(FINISH_POSITION)
              const foundWinner = await getPlayer(userData.userID)
              if (foundWinner) {
                updateWinner(foundWinner)
              }
              finishGame()
            }
          },
        }}>
        <FinishControl {...finishProps}>
          <FinishLine />
        </FinishControl>
      </finishControlDepsContext.Provider>

      {stones.map(({ position, rotation }) => (
        <StaticObstacle
          key={`stone-${position.join()}`}
          model={<Stone />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {tallStones.map(({ position, rotation }) => (
        <StaticObstacle
          key={`tall-stone-${position.join()}`}
          model={<TallStone />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
    </>
  )
}

export default GameMap
