import Dirt from '@modules/gameplay/dirt/Dirt'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import { Canvas } from '@react-three/fiber'

const Scene = () => {
  return (
    <Canvas>
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <Opponent />
      <Player />
      <Dirt />
    </Canvas>
  )
}

export default Scene
