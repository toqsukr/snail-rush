import { Vector3 } from 'three'
import { useSendFinishGame } from '@features/lobby-events'
import { useFollowTarget } from '@features/tracking-camera'
import { useGameStore } from '@features/game'
import { getPlayer } from '@entities/players'
import { TUser } from '@entities/user'
import { GameMap, MapData } from '@shared/lib/game/map'

type TUserData = {
  userID: TUser['id']
}

//TODO в бд итд
export const grassMapData: MapData = {
  planeModelPath: 'models/compressed_grass-map.glb',
  wallsModelPath: 'models/grass-walls.glb',
  startLine: { name: 'start-15.5,0.1,-12', position: [15.5, 0.1, -12], rotation: [0, -1.57, 0] },
  finishLine: { name: 'finish-54,0.5,-4', position: [54, 0.5, -4], rotation: [0, 4.26, 0] },
  obstacle: {
    chopper: {
      items: [
        {
          extremePositions: [
            [22.5, 3, -35],
            [5, 3, -45],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [25, 3, -45],
            [17.5, 3, -67.5],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [50, 3, -60],
            [62.5, 3, -70],
          ],
          speed: 10,
        },
        {
          extremePositions: [
            [70, 3, -60],
            [55, 3, -48],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [59, 3, -24],
            [80, 3, -26],
          ],
          speed: 15,
        },
        {
          extremePositions: [
            [80, 3, -26],
            [59, 3, -24],
          ],
          speed: 15,
        },
      ],
      modelPath: 'models/chopper.glb',
    },
    stone: {
      items: [
        { position: [69.85, 0, -39.61], rotation: [0, -0.58, 0], name: 'stone-66,0,-18' },
        { position: [63.57, 0, -14.97], rotation: [0, 0, 0], name: 'stone-61,0,-42' },
        { position: [63.28, 0, -32.24], rotation: [0, 0.9, 0], name: 'stone-70,0,-49' },
        { position: [59.58, 0, -42.51], rotation: [0, 0.7, 0], name: 'stone-57,0,-58' },
        { position: [26.1, 0, -68], rotation: [0, 0, 0], name: 'stone-26,0,-68' },
        { position: [34.87, 0, -62.59], rotation: [0, 0.4, 0], name: 'stone-28,0,-60' },
        { position: [59.91, 0, -58.94], rotation: [0, 0.8, 0], name: 'stone-34,0,-53' },
        { position: [34.1, 0, -52.1], rotation: [0, 0.8, 0], name: 'stone-34,0,-52' },
        { position: [16, 0, -47.1], rotation: [0, 0.4, 0], name: 'stone-15,0,-48' },
        { position: [11.1, 0, -32.2], rotation: [0, 1.3, 0], name: 'stone-11,0,-32' },
        { position: [19.6, 0, -28.8], rotation: [0, -1.2, 0], name: 'stone-20,0,-28' },
      ],
      modelPath: 'models/stone.glb',
    },
    smallStone: {
      items: [
        { position: [45.3, 0, -62], rotation: [0, 0, 0], name: 'smallStone-45,0,-62' },
        { position: [72.29, 0, -19.35], rotation: [0, 1, 0], name: 'smallStone-73,0,-21' },
        { position: [72.48, 0, -30.79], rotation: [0, -1.3, 0], name: 'smallStone-67,0,-30' },
        { position: [14.5, 0, -23.4], rotation: [0, 1.2, 0], name: 'smallStone-15,0,-23' },
        { position: [65.77, 0, -48.49], rotation: [0, 0.9, 0], name: 'smallStone-65,0,-59' },
      ],
      modelPath: 'models/small-stone.glb',
    },
    bigStone: { items: [], modelPath: 'models/big-stone.glb' },
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

export const GrassGameMap = () => {
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
