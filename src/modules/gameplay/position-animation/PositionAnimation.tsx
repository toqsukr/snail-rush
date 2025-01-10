import { animated } from '@react-spring/three'
import { forwardRef } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { PositionAnimationProp } from './PositionAnimation.type'

const PositionAnimation = forwardRef<Object3D<Object3DEventMap>, PositionAnimationProp>(
  ({ position, rotation, object }, ref) => {
    return (
      <animated.mesh position={position} rotation={rotation}>
        <primitive ref={ref} object={object} />
      </animated.mesh>
    )
  }
)

export default PositionAnimation
