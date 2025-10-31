import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, PropsWithChildren, useRef } from 'react'
import { usePlayerDeps } from '../deps'
import { useAdditiveRotation } from '../model/use-additive-rotation'
import { useSpaceHold } from '../model/use-space-hold'
import { pushPlayerPosition } from '../model/position-emitter'
import { pushPlayerRotation } from '../model/rotation-emitter'
import { Euler, Vector3 } from 'three'
import { MAX_SPACE_HOLD_TIME } from '@shared/config/game'

export const Player: FC<PropsWithChildren> = ({ children }) => {
  const { handleKeyUp, handleKeyDown } = useSpaceHold()
  const { incrementX, decrementX, resetX, calcRotationIncrement } = useAdditiveRotation()

  const [, getKeys] = useKeyboardControls<'left' | 'right' | 'jump'>()
  const wasLeft = useRef(false)
  const wasRight = useRef(false)
  const wasJumping = useRef(false)

  const { onJump, onRotate, canMove } = usePlayerDeps()

  const handleJump = (holdTime: number) => {
    if (!canMove()) return

    const koef = Math.max(.4, holdTime / MAX_SPACE_HOLD_TIME)
    const callback = (impulse: Vector3, duration: number) =>
      pushPlayerPosition({
        impulse,
        duration,
        holdTime,
      })
    onJump(koef, holdTime, callback)
  }

  const handleRotate = (directionKoef: number) => {
    if (!canMove()) return

    const callback = (updatedRotation: Euler, duration: number) =>
      pushPlayerRotation({
        rotation: updatedRotation,
        duration,
      })
    onRotate(directionKoef, callback)
  }

  useFrame(() => {
    if (!canMove()) return

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
