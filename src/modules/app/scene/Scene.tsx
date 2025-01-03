import Dirt from '@modules/gameplay/dirt/Dirt'
import Snail from '@modules/gameplay/snail/Snail'
import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const Scene = () => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[10, 1, 6]} rotation={[0, Math.PI / 2, 0]} />
      {/* <PerspectiveCamera
        makeDefault
        position={[8, 8, 14]}
        rotation={[-Math.PI / 4, Math.PI / 4, Math.PI / 4]}
      /> */}
      <directionalLight position={[-2, 5, 2]} intensity={3} />
      <directionalLight position={[5, 1, 0]} intensity={3} />
      <directionalLight position={[2, 5, 2]} intensity={3} />
      <Snail />
      <Dirt />
    </Canvas>
  )
}

export default Scene
