import { useSkinById } from '@entities/skin/query'
import { TUser, useUser } from '@entities/user'
import { useSendTargetPosition, useSendTargetRotation } from '@features/lobby-events'
import { isObstacle } from '@features/obstacle'
import { Player, playerDepsContext } from '@features/player-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { useFollowTarget } from '@features/tracking-camera'
import { FC, Suspense, useCallback } from 'react'
import { Vector3 } from 'three'
import { MAX_SPACE_HOLD_TIME, STUN_TIMEOUT } from '../../../app/constants'
import { getPlayerPosition, getStartPosition, getTexturePath } from '../lib/status'
import { useGameStore } from '../model/store'

const PlayerSnail: FC<{ user: TUser }> = ({ user }) => {
  const { moveable } = useGameStore()
  const followTarget = useFollowTarget()
  const sendTargetPosition = useSendTargetPosition()
  const sendTargetRotation = useSendTargetRotation()

  const {
    appendPosition,
    appendRotation,
    isJumping,
    rotation,
    calcAnimationDuration,
    calcTargetPosition,
    startShrinkAnimation,
    stopShrinkAnimation,
  } = useSnailContext()

  return (
    <playerDepsContext.Provider
      value={{
        calcTargetPosition,
        calcAnimationDuration,
        getMoveable: () => moveable,
        getRotation: () => rotation,
        getIsJumping: () => isJumping,
        maxSpaceHold: MAX_SPACE_HOLD_TIME,
        onStartShrink: startShrinkAnimation,
        onStopShrink: stopShrinkAnimation,
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
  const { data: skin } = useSkinById(user?.skinID ?? '')

  const onCollision = useCallback(() => {
    if (moveable) {
      updateMoveable(false)
      setTimeout(() => {
        updateMoveable(true)
      }, STUN_TIMEOUT)
    }
  }, [moveable])

  if (!playerStatus || !user) return

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? '')

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus))

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          texturePath,
          onCollision,
          stunTimeout: STUN_TIMEOUT,
          shouldHandleCollision: isObstacle,
          shrinkDuration: MAX_SPACE_HOLD_TIME,
        }}>
        <SnailProvider initPosition={playerStartPosition} initRotation={[0, Math.PI, 0]}>
          <PlayerSnail user={user} />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default PlayerSuspense
