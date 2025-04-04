import { useUser } from '@entities/user'
import { useLobbyEventsContext } from '@features/lobby-events'
import { isObstacle } from '@features/obstacle'
import { Player, playerDepsContext } from '@features/player-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { Suspense } from 'react'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const STUN_TIMEOUT = 1500

const PlayerSnail = () => {
  const moveable = useGameStore(s => s.moveable)

  const {
    appendPosition,
    appendRotation,
    isAnimating,
    rotation,
    calcAnimationDuration,
    calcTargetPosition,
  } = useSnailContext()

  const { sendTargetPosition, sendTargetRotation } = useLobbyEventsContext()

  return (
    <playerDepsContext.Provider
      value={{
        calcTargetPosition,
        calcAnimationDuration,
        getMoveable: () => moveable,
        getRotation: () => rotation,
        getIsAnimating: () => isAnimating,
        onJump: position => {
          appendPosition(position)
          sendTargetPosition({ position: { ...position, hold_time: position.holdTime } })
        },
        onRotate: rotation => {
          console.log('player rotate log', rotation)
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
        <SnailProvider>
          <PlayerSnail />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default PlayerSuspense
