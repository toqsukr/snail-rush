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
            [14, 3, -39],
          ],
          speed: 6,
        },
        {
          extremePositions: [
            [28, 3, -64],
            [23, 3, -69],
          ],
          speed: 6,
        },
        {
          extremePositions: [
            [54, 3, -64],
            [62.5, 3, -70],
          ],
          speed: 6,
        },
        {
          extremePositions: [
            [72, 3, -58],
            [65, 3, -55],
          ],
          speed: 6,
        },
        {
          extremePositions: [
            [65, 3, -26],
            [73, 3, -27],
          ],
          speed: 6,
        },
      ],
      modelPath: 'models/chopper.glb',
    },
    stone: {
      items: [
        { position: [76.33, 0.1, -49.15], rotation: [0, -0.31, 0], name: 'stone-66,0,-18' },
        { position: [73.75, 0.1, -19.39], rotation: [0, -0.24, 0], name: 'stone-61,0,-42' },
        { position: [74.56, 0.1, -33.86], rotation: [0, 0.9, 0], name: 'stone-70,0,-49' },
        { position: [68.77, 0.1, -48.05], rotation: [0, 0.7, 0], name: 'stone-57,0,-58' },
        { position: [27.35, 0.1, -58.13], rotation: [0, -0.49, 0], name: 'stone-26,0,-68' },
        { position: [48.11, 0.1, -64.94], rotation: [0.06, 1.53, -0.06], name: 'stone-28,0,-60' },
        { position: [62.48, 0.1, -61.52], rotation: [-3.14, 0.54, -3.14], name: 'stone-34,0,-53' },
        { position: [19.72, 0.1, -63.1], rotation: [0, 0.8, 0], name: 'stone-34,0,-52' },
        { position: [18.24, 0.1, -45.39], rotation: [0, 0.4, 0], name: 'stone-15,0,-48' },
        { position: [15.53, 0.1, -30.1], rotation: [0, 1.46, 0], name: 'stone-11,0,-32' },
        { position: [22.01, 0.1, -27.41], rotation: [0, -0.08, 0], name: 'stone-20,0,-28' },
      ],
      modelPath: 'models/stone.glb',
    },
    smallStone: {
      items: [
        { position: [67.32, 0.1, -32.87], rotation: [0, -1.3, 0], name: 'smallStone-67,0,-30' },
        { position: [23.83, 0.1, -40.49], rotation: [0, 1.2, 0], name: 'smallStone-15,0,-23' },
        { position: [72.2, 0.1, -65.52], rotation: [0, 0.9, 0], name: 'smallStone-65,0,-59' },
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
