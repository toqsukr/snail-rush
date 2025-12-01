import { Vector3 } from 'three'
import { getPlayer } from '@entities/players'
import { TUser } from '@entities/user'
import { useSendFinishGame } from '@features/lobby-events'
import { useFollowTarget } from '@features/tracking-camera'
import { useGameStore } from '@features/game'
import { GameMap, MapData } from '@shared/lib/game/map'

type TUserData = {
  userID: TUser['id']
}

//TODO в бд итд
export const grassMapData: MapData = {
  planeModelPath: 'models/grass-map.glb',
  wallsModelPath: 'models/grass-walls.glb',
  startLine: { position: [15.5, 0.1, -12], rotation: [0, -Math.PI / 2, 0] },
  finishLine: { position: [54, 0.5, -4], rotation: [0, Math.PI + Math.PI / 2.8, 0] },
  obstacle: {
    chopper: {
      items: [
        {
          extremePositions: [
            [30, 4, -45],
            [15, 4, -70],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [75, 4, -60],
            [53, 4, -48],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [25, 4, -35],
            [5, 4, -45],
          ],
          speed: 11,
        },
        {
          extremePositions: [
            [49, 4, -59],
            [65, 4, -72],
          ],
          speed: 10,
        },
        {
          extremePositions: [
            [58, 4, -24],
            [80, 4, -26],
          ],
          speed: 15,
        },
      ],
      modelPath: 'models/chopper.glb',
    },
    stone: {
      items: [
        { position: [67, 0, -12], rotation: [0, Math.PI / 2.8, 0] },
        { position: [62, 0, -19], rotation: [0, 0, 0] },
        { position: [63, 0, -31], rotation: [0, Math.PI / 3, 0] },
        { position: [73, 0, -36], rotation: [0, -Math.PI / 2.5, 0] },
        { position: [61, 0, -42], rotation: [0, 0, 0] },
        { position: [70, 0, -49], rotation: [0, Math.PI / 3.5, 0] },
        { position: [57, 0, -58], rotation: [0, Math.PI / 4, 0] },
        { position: [26, 0, -68], rotation: [0, 0, 0] },
        { position: [28, 0, -60], rotation: [0, 0, 0] },
        { position: [34, 0, -53], rotation: [0, Math.PI / 4, 0] },
        { position: [15, 0, -48], rotation: [0, 0, 0] },
        { position: [11, 0, -32], rotation: [0, Math.PI / 2.5, 0] },
        { position: [20, 0, -28], rotation: [0, -Math.PI / 3, 0] },
      ],
      modelPath: 'models/stone.glb',
    },
    smallStone: {
      items: [
        { position: [45, 0, -62], rotation: [0, 0, 0] },
        { position: [73, 0, -21], rotation: [0, Math.PI / 3, 0] },
        { position: [67, 0, -30], rotation: [0, -Math.PI / 2.5, 0] },
        { position: [15, 0, -23], rotation: [0, 0, 0] },
        { position: [65, 0, -59], rotation: [0, Math.PI / 3.5, 0] },
      ],
      modelPath: 'models/small-stone.glb',
    },
    bigStone: {
      items: [],
      modelPath: 'models/big-stone.glb',
    },
  },
}

const containsUserdata = (userData: unknown): userData is TUserData => {
  return (
    !!userData &&
    typeof userData === 'object' &&
    'userID' in userData &&
    typeof userData.userID === 'string'
  )
}

const GrassGameMap = () => {
  const sendFinishGame = useSendFinishGame()
  const followTarget = useFollowTarget()
  const { finishGame, updateWinner, updateMoveable, winner, started } = useGameStore()

  const onFinish = async (userData: unknown) => {
    if (containsUserdata(userData) && !winner) {
      updateMoveable(false)
      console.log('send finish')
      sendFinishGame()
      finishGame()
      setTimeout(async () => {
        await followTarget(new Vector3(...grassMapData.finishLine.position))
        const foundWinner = await getPlayer(userData.userID)
        if (foundWinner) {
          updateWinner(foundWinner)
        }
      })
    }
  }

  return <GameMap isStarted={started} onFinish={onFinish} mapData={grassMapData} />
}

export default GrassGameMap
