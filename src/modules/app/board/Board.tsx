import Scene from '@modules/app/scene/Scene'
import PauseMenu from '@modules/lobby/pause-menu/PauseMenu'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import WebSocketProvider from '../websocket-provider/WebSocketProvider'

const Board = () => {
  return (
    <WebSocketProvider>
      <Canvas>
        <Perf position='top-left' />
        <Scene />
        <Preload all />
      </Canvas>
      <PauseMenu />
    </WebSocketProvider>
  )
}

export default Board
