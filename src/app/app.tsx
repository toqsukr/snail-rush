import { TrackCameraProvider, trackingCameraDepsContext } from '@features/tracking-camera'
import HomePage from '@pages/home'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

const cameraStartPosition = [3, 35, -21]
const cameraStartRotation = [-Math.PI, 0, -Math.PI]

const App = () => {
  return (
    <Canvas>
      <Physics debug>
        <trackingCameraDepsContext.Provider
          value={{
            initPosition: cameraStartPosition,
            initRotation: cameraStartRotation,
          }}>
          <TrackCameraProvider>
            <Preload all />
            <Perf position='top-left' />
            <HomePage />
          </TrackCameraProvider>
        </trackingCameraDepsContext.Provider>
      </Physics>
    </Canvas>
  )
}

export default App
