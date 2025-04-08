import { TrackCameraProvider, trackingCameraDepsContext } from '@features/tracking-camera'
import HomePage from '@pages/home'
import { useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

const cameraStartPosition = [16.1, 35, 5]
const cameraStartRotation = [0, 0, 0]

const App = () => {
  useGLTF.preload('/animations/full-jump-static-light.glb')
  useGLTF.preload('/animations/full-jump-static-opponent.glb')

  return (
    <Canvas>
      <Physics debug gravity={[0, -20, 0]} timeStep={1 / 60} interpolate={false}>
        <trackingCameraDepsContext.Provider
          value={{
            initPosition: cameraStartPosition,
            initRotation: cameraStartRotation,
          }}>
          <TrackCameraProvider>
            <Perf position='top-left' />
            <HomePage />
          </TrackCameraProvider>
        </trackingCameraDepsContext.Provider>
      </Physics>
    </Canvas>
  )
}

export default App
