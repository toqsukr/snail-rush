import { RigidBody } from '@react-three/rapier'
import { FC } from 'react'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode }) => {
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
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Opponent
