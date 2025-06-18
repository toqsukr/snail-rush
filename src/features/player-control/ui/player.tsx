import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, PropsWithChildren, useRef } from 'react'
import { usePlayerDeps } from '../deps'
import { useAdditiveRotation } from '../model/use-additive-rotation'
import { useSpaceHold } from '../model/use-space-hold'

export const Player: FC<PropsWithChildren> = ({ children }) => {
  const { handleKeyUp, handleKeyDown } = useSpaceHold()
  const { incrementX, decrementX, resetX, calcRotationIncrement } = useAdditiveRotation()

  const [_, getKeys] = useKeyboardControls<'left' | 'right' | 'jump'>()
  const wasLeft = useRef(false)
  const wasRight = useRef(false)
  const wasJumping = useRef(false)

  const {
    getIsJumping,
    onJump,
    onRotate,
    calcTargetPosition,
    calcAnimationDuration,
    getRotation,
    getMoveable,
    maxSpaceHold,
  } = usePlayerDeps()

  const handleJump = (holdTime: number) => {
    const koef = holdTime / maxSpaceHold
    if (!getIsJumping() && getMoveable()) {
      const position = calcTargetPosition(koef)
      const duration = calcAnimationDuration(koef)
      const targetPosition = { ...position, duration, holdTime }
      onJump(targetPosition)
    }
  }

  const handleRotate = (directionKoef: number) => {
    if (!getIsJumping() && getMoveable()) {
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

  useFrame(() => {
    const keys = getKeys()

    if ((keys.left && wasRight.current) || (keys.right && wasLeft.current)) {
      resetX()
    }

    if (keys.left) {
      incrementX()
      handleRotate(calcRotationIncrement())
      wasLeft.current = true
      wasRight.current = false
    } else if (keys.right) {
      decrementX()
      handleRotate(calcRotationIncrement())
      wasRight.current = true
      wasLeft.current = false
    } else {
      resetX()
      wasLeft.current = false
      wasRight.current = false
    }

    if (keys.jump) {
      handleKeyDown()
      wasJumping.current = true
    } else if (wasJumping.current) {
      const duration = handleKeyUp()
      handleJump(duration)
      wasJumping.current = false
    }
  })

  return children
}
