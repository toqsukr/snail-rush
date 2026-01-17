import { FC, Suspense, useCallback } from 'react'
import { Euler, Vector3 } from 'three'
import { TUser, useUser } from '@entities/user'
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
import { MAX_SPACE_HOLD_TIME, STUN_TIMEOUT } from '@shared/config/game'
import { isObstacle } from '@shared/lib/game/obstacle'
import { useGameStore, getTexturePath, PlayerSkins, getStartPosition } from '@features/game'
import { useSkinById } from '@entities/skin'

const PlayerSnail: FC<{ user: TUser }> = ({ user }) => {
  const { moveable } = useGameStore()
  const calcAnimationDuration = useCalcAnimationDuration()

  const { rotation, startShrinkAnimation, stopShrinkAnimation, getIsJumping, getIsStuning } =
    useSnailContext()

  const onStartShrink = () => {
    startShrinkAnimation?.()
  }

  const onStopShrink = () => {
    stopShrinkAnimation?.()
  }

  const onJump = (
    koef: number,
    _holdTime: number,
    pushCallback: (impulse: Vector3, duration: number) => void,
  ) => {
    const impulse = calculateImpulse(rotation, koef)
    const duration = calcAnimationDuration(0)
    pushCallback(impulse, duration)
  }

  const onRotate = (
    pitchIncrement: number,
    pushCallback: (updatedRotation: Euler, duration: number) => void,
  ) => {
    const targetRotation = rotation.set(rotation.x, rotation.y + pitchIncrement, rotation.z)
    const duration = 0
    pushCallback(targetRotation, duration)
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
  const { data: skin } = useSkinById(user?.skinID ?? '')
  const { moveable, updateMoveable, updatePlayerModelHandle } = useGameStore()

  const onCollision = useCallback(() => {
    if (moveable) {
      updateMoveable(false)
      setTimeout(() => {
        updateMoveable(true)
      }, STUN_TIMEOUT)
    }
  }, [moveable])

  if (!user) return

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  const playerStartPosition = getStartPosition(0)

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
