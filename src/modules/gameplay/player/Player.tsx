import { RigidBody } from '@react-three/rapier'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Object3D, Object3DEventMap, Vector3 } from 'three'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player = forwardRef<Object3D<Object3DEventMap>, PlayerProp>(
  ({ updateCameraPosition, playerID, mode }, ref) => {
    const modelRef = useRef<Object3D>(null)

    const onJump = (position: Vector3) => {
      updateCameraPosition(position)
    }

    const { rigidBodyRef, model } = usePlayer(mode, playerID, onJump)

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    return (
      <RigidBody ref={rigidBodyRef} type='dynamic' mass={0} colliders='cuboid'>
        <directionalLight
          position={[0, 1, 0]}
          intensity={3}
          lookAt={() => modelRef?.current?.position}
        />
        <primitive ref={modelRef} object={model.scene} />
      </RigidBody>
    )
  }
)

export default Player
