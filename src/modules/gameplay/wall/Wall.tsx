import { FC } from 'react'
import { WallProps } from './Wall.type'

const Wall: FC<WallProps> = ({ position, rotation = [0, 0, 0], size, color = 'grey' }) => {
  return (
    <mesh receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default Wall
