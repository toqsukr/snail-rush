import Dirt from '@modules/gameplay/dirt/Dirt'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import StartLine from '@modules/gameplay/start-line/StartLine'
import { useAppState } from '@modules/gameplay/store'
import MenuWrapper from '@modules/lobby/menu-wrapper/MenuWrapper'
import { useLobby } from '@modules/lobby/store'
import { animated, useSpring } from '@react-spring/three'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { Object3D, PerspectiveCamera as PerspectiveCameraType, Vector3 } from 'three'
import { calcRotation, getGlobalPosition } from '../util'
import { SpringSettings } from './Scene.type.d'

const Scene = () => {
  const playerRef = useRef<Object3D>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)
  const startRef = useRef<Object3D>(null)
  const { status } = useLobby()

  const { started, onGameStart } = useAppState()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 28, -15],
    rotation: [-Math.PI, 0, -Math.PI],
  }))

  const handleStart = () => {
    if (!started && playerRef.current && cameraRef.current) {
      const playerPosition = getGlobalPosition(playerRef.current)

      const targetPosition: [number, number, number] = [playerPosition.x, 22, playerPosition.z - 17]

      const targetRotation = calcRotation(
        new Vector3(...targetPosition),
        playerPosition,
        cameraRef.current.matrixWorld
      )

      api.start({
        to: next => {
          next({
            position: targetPosition,
            onRest: () => {
              onGameStart()
            },
            config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
          }),
            next({ rotation: targetRotation, config: { mass: 1, tension: 50, friction: 40 } })
        },
      })
    }
  }

  const updateCameraPosition = () => {
    if (playerRef.current && cameraRef.current) {
      const { x, y, z } = getGlobalPosition(playerRef.current)

      console.log(x, y, z)

      api.start({
        position: [x, y + 22, z - 17],
        config: { mass: 1, tension: 50, friction: 40 },
      })
    }
  }

  return (
    <>
      <animated.group position={spring.position} rotation={spring.rotation as any}>
        <PerspectiveCamera makeDefault ref={cameraRef} />
      </animated.group>
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <MenuWrapper handleStart={handleStart} />
      <StartLine ref={startRef} />
      <Dirt />
      {status && (
        <>
          <Player ref={playerRef} status={status} updateCameraPosition={updateCameraPosition} />
          <Opponent status={status} />
        </>
      )}
    </>
  )
}

export default Scene
