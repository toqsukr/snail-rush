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
  planeModelPath: 'models/grass-plane.glb',
  wallsModelPath: 'models/grass-walls.glb',
  decorationModelPath: 'models/grass-decor.glb',
  startLine: { name: 'start-15.5,0.1,-12', position: [19, 0.1, -14], rotation: [0, -1.57, 0] },
  finishLine: { name: 'finish-54,0.5,-4', position: [60.5, 0.1, -9], rotation: [0, 4.26, 0] },
  obstacle: {
    chopper: {
      items: [
        {
          extremePositions: [
            [24, 3, -35],
            [12, 3, -40],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [18, 3, -56],
            [25, 3, -45],
          ],
          speed: 13,
        },
        {
          extremePositions: [
            [54, 3, -64],
            [62.5, 3, -70],
          ],
          speed: 10,
        },
        {
          extremePositions: [
            [72, 3, -60],
            [64, 3, -53],
          ],
          speed: 12,
        },
        {
          extremePositions: [
            [63, 3, -26],
            [75, 3, -28],
          ],
          speed: 15,
        },
      ],
      modelPath: 'models/chopper.glb',
    },
    stone: {
      items: [
        { position: [74.5, 0.1, -42.46], rotation: [0, -0.58, 0], name: 'stone-66,0,-18' },
        { position: [64.39, 0.1, -20.3], rotation: [0, 0, 0], name: 'stone-61,0,-42' },
        { position: [73.66, 0.1, -33.42], rotation: [0, 0.9, 0], name: 'stone-70,0,-49' },
        { position: [68.93, 0.1, -47.36], rotation: [0, 0.7, 0], name: 'stone-57,0,-58' },
        { position: [27.35, 0.1, -70.03], rotation: [0, 0, 0], name: 'stone-26,0,-68' },
        { position: [35.72, 0.1, -67.53], rotation: [0, 0.4, 0], name: 'stone-28,0,-60' },
        { position: [62.85, 0.1, -62.2], rotation: [0, 0.8, 0], name: 'stone-34,0,-53' },
        { position: [24.96, 0.1, -59.78], rotation: [0, 0.8, 0], name: 'stone-34,0,-52' },
        { position: [18.24, 0.1, -45.39], rotation: [0, 0.4, 0], name: 'stone-15,0,-48' },
        { position: [18.27, 0.1, -31.33], rotation: [0, 1.3, 0], name: 'stone-11,0,-32' },
        { position: [22.58, 0.1, -26.78], rotation: [0, -0.08, 0], name: 'stone-20,0,-28' },
      ],
      modelPath: 'models/stone.glb',
    },
    smallStone: {
      items: [
        { position: [45.3, 0.1, -68.32], rotation: [0, 0, 0], name: 'smallStone-45,0,-62' },
        { position: [69.69, 0.1, -18.87], rotation: [0, 1, 0], name: 'smallStone-73,0,-21' },
        { position: [68.99, 0.1, -32.87], rotation: [0, -1.3, 0], name: 'smallStone-67,0,-30' },
        { position: [23.83, 0.1, -40.49], rotation: [0, 1.2, 0], name: 'smallStone-15,0,-23' },
        { position: [73.3, 0.1, -54.58], rotation: [0, 0.9, 0], name: 'smallStone-65,0,-59' },
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
  const { finishGame, updateWinner, updateMoveable, winner, started, startedAt } = useGameStore()

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

  return (
    <GameMap isStarted={started} startedAt={startedAt} onFinish={onFinish} mapData={grassMapData} />
  )
}
