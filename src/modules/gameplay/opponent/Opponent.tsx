import { RigidBody } from '@react-three/rapier'
import { FC } from 'react'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode }) => {
  const { rigidBodyRef, model } = useOpponent(mode)

  return (
    <RigidBody ref={rigidBodyRef} mass={0} type='dynamic' colliders='cuboid'>
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Opponent
