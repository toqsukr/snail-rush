import { useSkinById } from '@entities/skin/query'
import { TUser, useUser } from '@entities/user'
import { useSendMoveImpulse, useSendShrink, useSendTargetRotation } from '@features/lobby-events'
import {
  Player,
  playerDepsContext,
  playerPositionEmitter,
  playerRotationEmitter,
} from '@features/player-control'
import {
  calculateImpulse,
  Snail,
  snailDepsContext,
  SnailProvider,
  useCalcAnimationDuration,
  useSnailContext,
} from '@features/snail'
import { FC, Suspense, useCallback } from 'react'
import { Euler, Vector3 } from 'three'
import {
  getPlayerPosition,
  getStartPosition,
  getTexturePath,
  PlayerSkins,
  useGameStore,
} from '@features/game'
import { MAX_SPACE_HOLD_TIME, STUN_TIMEOUT } from '@shared/config/game'
import { isObstacle } from '@shared/lib/game/obstacle'

const PlayerSnail: FC<{ user: TUser }> = ({ user }) => {
  const { moveable } = useGameStore()
  const sendStartShrink = useSendShrink()
  const sendTargetPosition = useSendMoveImpulse()
  const sendTargetRotation = useSendTargetRotation()
  const calcAnimationDuration = useCalcAnimationDuration()

  const {
    rotation,
    getIsJumping,
    startShrinkAnimation,
    stopShrinkAnimation,
    getPosition,
    getIsStuning,
  } = useSnailContext()

  const onStartShrink = () => {
    startShrinkAnimation?.()
    sendStartShrink(getPosition())
  }

  const onStopShrink = () => {
    stopShrinkAnimation?.()
  }

  const onJump = (
    koef: number,
    holdTime: number,
    pushCallback: (impulse: Vector3, duration: number) => void
  ) => {
    const impulse = calculateImpulse(rotation, koef)
    const duration = calcAnimationDuration(0)
    pushCallback(impulse, duration)
    const move = {
      x: impulse.x,
      y: impulse.y,
      z: impulse.z,
      duration,
      position: getPosition(),
      hold_time: holdTime,
    }
    sendTargetPosition({ move })
  }

  const onRotate = (
    pitchIncrement: number,
    pushCallback: (updatedRotation: Euler, duration: number) => void
  ) => {
    const targetRotation = rotation.set(rotation.x, rotation.y + pitchIncrement, rotation.z)
    const duration = 0
    pushCallback(targetRotation, duration)
    sendTargetRotation({
      rotation: {
        duration,
        roll: targetRotation.x,
        pitch: targetRotation.y,
        yaw: targetRotation.z,
      },
    })
  }

  const canMove = () => {
    return moveable && !getIsStuning() && !getIsJumping()
  }

  return (
    <playerDepsContext.Provider
      value={{
        onJump,
        onRotate,
        canMove,
        onStartShrink,
        onStopShrink,
      }}>
      <Player>
        <Snail userID={user.id} username={user.username} />
      </Player>
    </playerDepsContext.Provider>
  )
}

const PlayerSuspense = () => {
  const { data: user } = useUser()
  const { moveable, updateMoveable, playerStatus, updatePlayerModelHandle } = useGameStore()
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

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus))

  const playerStartRotation = new Euler(0, Math.PI, 0)

  const handleModelHandle = (modelHandle: number) => {
    updatePlayerModelHandle(modelHandle)
  }

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          texturePath,
          onCollision,
          handleModelHandle,
          stunTimeout: STUN_TIMEOUT,
          shouldHandleCollision: isObstacle,
          shrinkDuration: MAX_SPACE_HOLD_TIME,
          positionEmitter: playerPositionEmitter,
          rotationEmitter: playerRotationEmitter,
        }}>
        <SnailProvider initPosition={playerStartPosition} initRotation={playerStartRotation}>
          <PlayerSnail user={user} />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default PlayerSuspense
