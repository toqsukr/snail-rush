import { FC, PropsWithChildren, useEffect } from 'react'
import { usePlayerDeps } from '../deps'
import { useAdditiveRotation } from '../model/use-additive-rotation'
import { useSpaceHold } from '../model/use-space-hold'

const SPACE_HOLD_TIME = 1000

export const Player: FC<PropsWithChildren> = ({ children }) => {
  const { handleKeyUp, handleKeyDown } = useSpaceHold(SPACE_HOLD_TIME)
  const { incrementX, decrementX, resetX, calcRotationIncrement } = useAdditiveRotation()

  const {
    getIsAnimating,
    onJump,
    onRotate,
    calcTargetPosition,
    calcAnimationDuration,
    getRotation,
    getMoveable,
  } = usePlayerDeps()

  const handleJump = (holdTime: number) => {
    const koef = holdTime / SPACE_HOLD_TIME
    if (!getIsAnimating() && getMoveable()) {
      const position = calcTargetPosition(koef)
      const duration = calcAnimationDuration(koef)
      const targetPosition = { ...position, duration, holdTime }
      onJump(targetPosition)
    }
  }

  const handleRotate = (directionKoef: number) => {
    if (!getIsAnimating() && getMoveable()) {
      const rotationArr = getRotation()
      const updatedPitch = directionKoef
      const rotation = {
        roll: rotationArr[0],
        pitch: rotationArr[1] + updatedPitch,
        yaw: rotationArr[2],
      }
      const targetRotation = { ...rotation, duration: 0 }
      onRotate(targetRotation)
    }
  }

  const spaceCallback = (e: KeyboardEvent) => {
    if (e.key == ' ' || e.code == 'Space') {
      const duration = handleKeyUp(e)
      handleJump(duration)
    }

    if (e.code == 'ArrowRight' || e.code == 'ArrowLeft') {
      resetX()
    }
  }

  const arrowCallback = (e: KeyboardEvent) => {
    if (e.code == 'ArrowRight') {
      decrementX()
      handleRotate(calcRotationIncrement())
    }
    if (e.code == 'ArrowLeft') {
      incrementX()
      handleRotate(calcRotationIncrement())
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
