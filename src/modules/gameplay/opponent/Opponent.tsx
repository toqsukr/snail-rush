import { RigidBody } from '@react-three/rapier'
import { FC } from 'react'
import JumpAnimation from '../position-animation/PositionAnimation'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode }) => {
  const { rigidBodyRef, model, position, rotation } = useOpponent(mode)

  return (
    <RigidBody ref={rigidBodyRef} colliders='ball'>
      <JumpAnimation position={position as any} rotation={rotation as any} object={model.scene} />
    </RigidBody>
  )
}

export default Opponent
