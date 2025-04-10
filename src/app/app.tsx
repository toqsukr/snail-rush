import { TrackCameraProvider, trackingCameraDepsContext } from '@features/tracking-camera'
import HomePage from '@pages/home'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

const cameraStartPosition = [16.1, 35, 5]
const cameraStartRotation = [0, 0, 0]

const App = () => {
  return (
    <Canvas>
      <Physics gravity={[0, -20, 0]} timeStep={1 / 60} interpolate={false}>
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
