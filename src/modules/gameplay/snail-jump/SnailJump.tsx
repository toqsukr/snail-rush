import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import JumpAnimation from '../jump-animation/PositionAnimation'
import { useAppState } from '../store'
import { useSpaceHold } from '../useSpaceHold'
import { SnailJumpProp } from './SnailJump.type.d'
import { useSnailJump } from './useSnailJump'

const SnailJump = forwardRef<Object3D<Object3DEventMap>, SnailJumpProp>(
  ({ updateCameraPosition }, ref) => {
    const { handleKeyDown, handleKeyUp } = useSpaceHold(1000)
    const { modelRef, model, position, rotation, triggerJump, triggerRotate, isJumping } =
      useSnailJump('animations/full-jump-static.glb')
    const { started } = useAppState()

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    const handleJump = (koef: number) => {
      if (!isJumping() && started) {
        triggerJump(koef)
        updateCameraPosition()
      }
    }

    const spaceCallback = (e: KeyboardEvent) => {
      if (e.key == ' ' || e.code == 'Space') {
        const duration = handleKeyUp(e)
        handleJump(duration / 1000)
      }
    }

    const arrowCallback = (e: KeyboardEvent) => {
      if (e.code == 'ArrowRight') {
        triggerRotate(-0.2)
      }
      if (e.code == 'ArrowLeft') {
        triggerRotate(0.2)
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

    return (
      <JumpAnimation
        ref={modelRef}
        position={position as any}
        rotation={rotation as any}
        object={model.scene}
      />
    )
  }
)

export default SnailJump
