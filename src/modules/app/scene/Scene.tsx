import FinishLine from '@modules/gameplay/finish-line/FinishLine'
import Map from '@modules/gameplay/map/Map'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import StartLine from '@modules/gameplay/start-line/StartLine'
import StartTimer from '@modules/gameplay/start-timer/StartTimer'
import Stone from '@modules/gameplay/stone/Stone'
import { useAppState } from '@modules/gameplay/store'
import MenuWrapper from '@modules/lobby/menu-wrapper/MenuWrapper'
import { useLobby } from '@modules/lobby/store'
import { usePlayerData } from '@modules/player/store'
import { animated } from '@react-spring/three'
import { PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { useScene } from './useScene'

const Scene = () => {
  const { status } = useLobby()
  const { countdown } = useAppState()
  const { player_id } = usePlayerData()
  const { playerRef, cameraRef, startRef, ...options } = useScene()
  const { spring, updateCameraPosition } = options

  return (
    <Physics>
      <animated.group position={spring.position} rotation={spring.rotation as any}>
        <PerspectiveCamera makeDefault ref={cameraRef} />
      </animated.group>
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <MenuWrapper />
      <StartLine ref={startRef} />
      <FinishLine />
      <Map />
      <Stone />

      <Suspense fallback={null}>{status && countdown && <StartTimer status={status} />}</Suspense>

      <Suspense fallback={null}>
        {status && player_id && (
          <>
            <Player
              ref={playerRef}
              mode={status}
              updateCameraPosition={updateCameraPosition}
              playerID={player_id}
            />
            <Opponent mode={status} />
          </>
        )}
      </Suspense>
    </Physics>
  )
}

export default Scene
