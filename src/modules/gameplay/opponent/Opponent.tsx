import { Text } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { FC } from 'react'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode, nickname }) => {
  const { rigidBodyRef, model } = useOpponent(mode)

  return (
    <RigidBody
      ref={rigidBodyRef}
      type='dynamic'
      enabledRotations={[false, false, false]}
      linearDamping={1.5}
      friction={0.5}
      mass={1}
      colliders='cuboid'>
      <Text position={[0, 3, 0]} rotation={[0, Math.PI, 0]}>
        {nickname}
      </Text>
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Opponent
