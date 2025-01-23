import { FC } from 'react'
import { IlluminatedPlayerProp } from './IlluminatedPlayer.type'

const IlluminatedPlayer: FC<IlluminatedPlayerProp> = ({ player }) => {
  return (
    <group>
      <spotLight penumbra={1} intensity={25} position={[0, 3.5, -1]} angle={(2 * Math.PI) / 6} />
      {player}
    </group>
  )
}

export default IlluminatedPlayer
