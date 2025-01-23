import { RigidBody } from '@react-three/rapier'
import { FC, useRef } from 'react'
import { Object3D } from 'three'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode }) => {
  const modelRef = useRef<Object3D>(null)

  const { rigidBodyRef, model } = useOpponent(mode)

  return (
    <RigidBody ref={rigidBodyRef} mass={0} type='dynamic' colliders='cuboid'>
      <directionalLight
        position={[0, 1, 0]}
        intensity={3}
        lookAt={() => modelRef?.current?.position}
      />
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Opponent
