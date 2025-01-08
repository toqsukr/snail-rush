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
    const { model, isJumping, position, modelRef, triggerJump } = useSnailJump(
      'animations/full-jump-static.glb'
    )
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

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', spaceCallback)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', spaceCallback)
      }
    }, [handleJump])

    return <JumpAnimation ref={modelRef} position={position as any} object={model.scene} />
  }
)

export default SnailJump
