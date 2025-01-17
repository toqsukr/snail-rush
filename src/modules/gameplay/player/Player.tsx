import { RigidBody } from '@react-three/rapier'
import { forwardRef } from 'react'
import { Object3D, Object3DEventMap, Vector3 } from 'three'
import JumpAnimation from '../position-animation/PositionAnimation'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player = forwardRef<Object3D<Object3DEventMap>, PlayerProp>(
  ({ updateCameraPosition, playerID, mode }, ref) => {
    const onJump = (position: Vector3) => {
      updateCameraPosition(position)
    }

    const { rigidBodyRef, model, position, rotation } = usePlayer(mode, playerID, onJump)

    return (
      <RigidBody ref={rigidBodyRef} colliders='ball'>
        <JumpAnimation
          ref={ref}
          position={position as any}
          rotation={rotation as any}
          object={model.scene}
        />
      </RigidBody>
    )
  }
)

export default Player
