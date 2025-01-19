import { RigidBody } from '@react-three/rapier'
import { forwardRef } from 'react'
import { Object3D, Object3DEventMap, Vector3 } from 'three'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player = forwardRef<Object3D<Object3DEventMap>, PlayerProp>(
  ({ updateCameraPosition, playerID, mode }, ref) => {
    const onJump = (position: Vector3) => {
      updateCameraPosition(position)
    }

    const { rigidBodyRef, model } = usePlayer(mode, playerID, onJump)

    return (
      <RigidBody ref={rigidBodyRef} type='dynamic' mass={0} colliders='cuboid'>
        <primitive ref={ref} object={model.scene} />
      </RigidBody>
    )
  }
)

export default Player
