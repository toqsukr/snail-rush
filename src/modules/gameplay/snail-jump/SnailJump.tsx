import { animated } from '@react-spring/three'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { useAppState } from '../store'
import { SnailJumpProp } from './SnailJump.type.d'
import { useSnailJump } from './useSnailJump'

const SnailJump = forwardRef<Object3D<Object3DEventMap>, SnailJumpProp>(
  ({ updateCameraPosition }, ref) => {
    const { isJumping, position, modelRef, model, triggerJump } = useSnailJump()
    const { started } = useAppState()

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    const handleJump = () => {
      if (!isJumping() && started) {
        triggerJump()
        updateCameraPosition()
      }
    }

    const spaceCallback = (e: KeyboardEvent) => {
      if (e.key == ' ' || e.code == 'Space') {
        handleJump()
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', spaceCallback)

      return () => {
        window.removeEventListener('keydown', spaceCallback)
      }
    }, [handleJump])

    return (
      <animated.mesh position={position as any}>
        <primitive ref={modelRef} object={model.scene} />
      </animated.mesh>
    )
  }
)

export default SnailJump
