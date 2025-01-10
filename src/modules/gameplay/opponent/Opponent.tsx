import { FC } from 'react'
import JumpAnimation from '../position-animation/PositionAnimation'
import { OpponentProp } from './Opponent.type'
import { useOpponent } from './useOpponent'

const Opponent: FC<OpponentProp> = ({ mode }) => {
  const { modelRef, model, position, rotation } = useOpponent(mode)

  return (
    <JumpAnimation
      ref={modelRef}
      position={position as any}
      rotation={rotation as any}
      object={model.scene}
    />
  )
}

export default Opponent
