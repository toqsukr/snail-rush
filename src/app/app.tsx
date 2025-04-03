import HomePage from '@pages/home'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

const App = () => {
  return (
    <Canvas>
      <Physics debug>
        <Preload all />
        <Perf position='top-left' />
        <HomePage />
      </Physics>
    </Canvas>
  )
}

export default App
