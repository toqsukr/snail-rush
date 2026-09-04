import { FC, Suspense } from 'react'
import { Euler, Vector3 } from 'three'
import {
  BOUNCE_HOLD_TIME,
  SNAPSHOT_HOLD_TIME,
  useSendMoveImpulse,
  useSendShrink,
  useSendTargetRotation,
} from '@features/lobby-events'
import {
  Player,
  playerDepsContext,
  playerPositionEmitter,
  playerRotationEmitter,
  useControlParams,
} from '@features/player-control'
import {
  calculateImpulse,
  Snail,
  snailDepsContext,
  SnailProvider,
  useCalcAnimationDuration,
  useSnailContext,
  useSnailParams,
  type SnapshotType,
} from '@features/snail'
import {
  getPlayerPosition,
  getStartPosition,
  getTexturePath,
  PlayerSkins,
  useGameStore,
  useStunLock,
} from '@features/game'
import { useSkinById } from '@entities/skin'
import { TUser, useUser } from '@entities/user'
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
    pushCallback: (impulse: Vector3, duration: number) => void,
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
    pushCallback: (updatedRotation: Euler, duration: number) => void,
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

export const PlayerSuspense = () => {
  const { data: user } = useUser()
  const { playerStatus, updatePlayerModelHandle, started, finished, pause } = useGameStore()
  const { data: skin } = useSkinById(user?.skinID ?? '')
  const sendMove = useSendMoveImpulse()
  const stunLock = useStunLock()
  const { stunTimeout } = useSnailParams()
  const { maxSpaceHoldTime: shrinkDuration } = useControlParams()

  const onCollision = ({ position, impulse }: { position: Vector3; impulse: Vector3 }) => {
    if (!started || finished || pause) return
    sendMove({
      move: {
        x: impulse.x,
        y: impulse.y,
        z: impulse.z,
        duration: 0,
        position,
        bounced: true,
        hold_time: BOUNCE_HOLD_TIME,
      },
    })
    stunLock(stunTimeout)
  }

  const onSnapshot = ({ position, velocity }: SnapshotType) => {
    if (!started || finished || pause) return
    sendMove({
      move: {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
        duration: 0,
        position,
        snapshot: true,
        hold_time: SNAPSHOT_HOLD_TIME,
      },
    })
  }

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
          onSnapshot,
          handleModelHandle,
          stunTimeout,
          shouldHandleCollision: isObstacle,
          shrinkDuration,
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
