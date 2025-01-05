import { animated } from '@react-spring/three'
import { forwardRef, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { SnailJumpProp } from './SnailJump.type'
import { useSnailJump } from './useSnailJump'

const SnailJump = forwardRef<Object3D<Object3DEventMap>, SnailJumpProp>(
  ({ updateCameraPosition }, ref) => {
    const { position, modelRef, model, triggerJump } = useSnailJump()

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    const handleJump = () => {
      triggerJump()
      updateCameraPosition()
    }

    return (
      <animated.mesh position={position as any}>
        <primitive ref={modelRef} object={model.scene} onClick={handleJump} />
      </animated.mesh>
    )
  }
)

export default SnailJump
