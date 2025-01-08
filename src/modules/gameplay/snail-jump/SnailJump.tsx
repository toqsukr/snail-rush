import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { HOST_START_POSITION, JOINED_START_POSITION, SPACE_HOLD_TIME } from '../constant'
import JumpAnimation from '../jump-animation/PositionAnimation'
import { useAppState } from '../store'
import { useSpaceHold } from '../useSpaceHold'
import { SnailJumpProp } from './SnailJump.type.d'
import { useSnailJump } from './useSnailJump'

const SnailJump = forwardRef<Object3D<Object3DEventMap>, SnailJumpProp>(
  ({ updateCameraPosition, status }, ref) => {
    const startPosition = status === 'host' ? HOST_START_POSITION : JOINED_START_POSITION
    const animationData = `animations/full-jump-static${status === 'joined' ? '-opponent' : ''}.glb`

    const { handleKeyDown, handleKeyUp } = useSpaceHold(SPACE_HOLD_TIME)
    const jumpOptions = useSnailJump(animationData, startPosition)
    const { started } = useAppState()

    const { modelRef, model, position, rotation, triggerJump, triggerRotate, isJumping } =
      jumpOptions

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    const handleJump = (koef: number) => {
      if (!isJumping() && started) {
        triggerJump(koef)
        updateCameraPosition()
      }
    }

    const handleRotate = (koef: number) => {
      if (!isJumping()) {
        triggerRotate(koef)
      }
    }

    const spaceCallback = (e: KeyboardEvent) => {
      if (e.key == ' ' || e.code == 'Space') {
        const duration = handleKeyUp(e)
        handleJump(duration / SPACE_HOLD_TIME)
      }
    }

    const arrowCallback = (e: KeyboardEvent) => {
      if (e.code == 'ArrowRight') {
        handleRotate(-0.2)
      }
      if (e.code == 'ArrowLeft') {
        handleRotate(0.2)
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
