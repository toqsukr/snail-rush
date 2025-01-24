import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import MainScene from '@scenes/main-scene/MainScene'
import MapScene from '@scenes/map-scene/MapScene'
import MenuScene from '@scenes/menu-scene/MenuScene'
import PlayersScene from '@scenes/players-scene/PlayersScene'
import StartTimerScene from '@scenes/start-timer-scene/StartTimerScene'
import WebSocketProvider from './websocket-provider/WebSocketProvider'

const App = () => {
  return (
    <WebSocketProvider>
      <Canvas>
        <Physics debug>
          <MainScene>
            <MenuScene />
            <PlayersScene />
            <StartTimerScene />
            <MapScene />
          </MainScene>
        </Physics>
      </Canvas>
    </WebSocketProvider>
  )
}

export default App
