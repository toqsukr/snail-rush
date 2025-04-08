import { TUser, useUser } from '@entities/user'
import { useLobbyEventsContext } from '@features/lobby-events'
import { isObstacle } from '@features/obstacle'
import { Player, playerDepsContext } from '@features/player-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { useTrackCameraContext } from '@features/tracking-camera'
import { Preload } from '@react-three/drei'
import { FC, Suspense } from 'react'
import { Vector3 } from 'three'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const STUN_TIMEOUT = 2000

const PlayerSnail: FC<{ user: TUser }> = ({ user }) => {
  const { moveable } = useGameStore()
  const { followTarget } = useTrackCameraContext()

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
          const { x, y, z } = position
          appendPosition(position)
          followTarget(new Vector3(x, y, z))
          sendTargetPosition({ position: { ...position, hold_time: position.holdTime } })
        },
        onRotate: rotation => {
          appendRotation(rotation)
          sendTargetRotation({ rotation })
        },
      }}>
      <Player>
        <Snail userID={user.id} username={user.username} />
      </Player>
    </playerDepsContext.Provider>
  )
}

const PlayerSuspense = () => {
  const user = useUser(s => s.user)
  const { moveable, updateMoveable, playerStatus } = useGameStore()

  const onCollision = () => {
    if (moveable) {
      updateMoveable(false)
      setTimeout(() => {
        updateMoveable(true)
      }, STUN_TIMEOUT)
    }
  }

  if (!playerStatus || !user) return

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus))

  return (
    <Suspense fallback={null}>
      <Preload all />
      <snailDepsContext.Provider
        value={{
          onCollision,
          shouldHandleCollision: isObstacle,
          modelPath: getModelPath(getPlayerSkin(playerStatus)),
        }}>
        <SnailProvider initPosition={playerStartPosition} initRotation={[0, Math.PI, 0]}>
          <PlayerSnail user={user} />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default PlayerSuspense
