import { FC, PropsWithChildren, useEffect } from 'react'
import { usePlayerDeps } from '../deps'
import { useSpaceHold } from '../model/use-space-hold'

const SPACE_HOLD_TIME = 1300

export const Player: FC<PropsWithChildren> = ({ children }) => {
  const { handleKeyUp, handleKeyDown } = useSpaceHold(SPACE_HOLD_TIME)
  const {
    isJumping,
    onJump,
    onRotate,
    calcTargetPosition,
    calcAnimationDuration,
    getRotation,
    isMoveable,
  } = usePlayerDeps()

  const handleJump = (holdTime: number) => {
    const koef = holdTime / SPACE_HOLD_TIME
    if (!isJumping && isMoveable) {
      const position = calcTargetPosition(koef)
      const duration = calcAnimationDuration(koef)
      const targetPosition = { ...position, duration, holdTime }
      onJump(targetPosition)
    }
  }

  const handleRotate = (directionKoef: number) => {
    const koef = 0.2 * directionKoef
    if (!isJumping && isMoveable) {
      const rotationArr = getRotation()
      const updatedPitch = rotationArr[1] + koef
      const rotation = { roll: rotationArr[0], pitch: updatedPitch, yaw: rotationArr[2] }
      const targetRotation = { ...rotation, duration: 0 }
      onRotate(targetRotation)
    }
  }

  const spaceCallback = (e: KeyboardEvent) => {
    if (e.key == ' ' || e.code == 'Space') {
      const duration = handleKeyUp(e)
      handleJump(duration)
    }
  }

  const arrowCallback = (e: KeyboardEvent) => {
    if (e.code == 'ArrowRight') {
      handleRotate(-1)
    }
    if (e.code == 'ArrowLeft') {
      handleRotate(1)
    }
    handleKeyDown(e)
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowCallback)
    window.addEventListener('keyup', spaceCallback)

    return () => {
      window.removeEventListener('keydown', arrowCallback)
      window.removeEventListener('keyup', spaceCallback)
    }
  }, [handleJump])

  return children
}
