import { useUser } from '@entities/user'
import { useLobbyEventsContext } from '@features/lobby-events'
import { isObstacle } from '@features/obstacle'
import { Player, playerDepsContext } from '@features/player-control'
import {
  Snail,
  snailDepsContext,
  SnailOrientationProvider,
  useCalcAnimationDuration,
  useCalcTargetPosition,
  useGetRotation,
  useIsAnimating,
  useSnailOrientationContext,
} from '@features/snail'
import { Suspense } from 'react'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const STUN_TIMEOUT = 1500

const PlayerSnail = () => {
  const moveable = useGameStore(s => s.moveable)

  const { appendPosition, appendRotation } = useSnailOrientationContext()
  const { sendTargetPosition, sendTargetRotation } = useLobbyEventsContext()

  const getRotation = useGetRotation()
  const calcAnimationDuration = useCalcAnimationDuration()
  const calcTargetPosition = useCalcTargetPosition()
  const getIsAnimating = useIsAnimating()

  return (
    <playerDepsContext.Provider
      value={{
        getRotation,
        getIsAnimating,
        calcTargetPosition,
        getMoveable: () => moveable,
        calcAnimationDuration: koef => calcAnimationDuration(0, koef),
        onJump: position => {
          appendPosition(position)
          sendTargetPosition({ position: { ...position, hold_time: position.holdTime } })
        },
        onRotate: rotation => {
          appendRotation(rotation)
          sendTargetRotation({ rotation })
        },
      }}>
      {/* <PerspectiveCamera makeDefault position={[0, 35, -21]} rotation={[-Math.PI, 0, -Math.PI]} /> */}
      <Player>
        <Snail />
      </Player>
    </playerDepsContext.Provider>
  )
}

const PlayerSuspense = () => {
  const { moveable, updateMoveable, playerStatus } = useGameStore()
  const user = useUser(s => s.user)

  if (!playerStatus || !user) return

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          shouldHandleCollision: isObstacle,
          modelPath: getModelPath(getPlayerSkin(playerStatus)),
          startPosition: getStartPosition(getPlayerPosition(playerStatus)),
          username: user?.username,
          onCollision: () => {
            if (moveable) {
              updateMoveable(false)
              setTimeout(() => {
                updateMoveable(true)
              }, STUN_TIMEOUT)
            }
          },
        }}>
        <SnailOrientationProvider>
          <PlayerSnail />
        </SnailOrientationProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default PlayerSuspense
