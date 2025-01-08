import Dirt from '@modules/gameplay/dirt/Dirt'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import StartLine from '@modules/gameplay/start-line/StartLine'
import { useAppState } from '@modules/gameplay/store'
import MenuWrapper from '@modules/lobby/menu-wrapper/MenuWrapper'
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
  const { started, onGameStart } = useAppState()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 28, -15],
    rotation: [-Math.PI, 0, -Math.PI],
  }))

  const handleStart = () => {
    if (!started && playerRef.current && cameraRef.current) {
      const targetPosition: [number, number, number] = [0, 22, playerRef.current.position.z - 17]

      const targetRotation = calcRotation(
        new Vector3(...targetPosition),
        playerRef.current.position,
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
      <Player ref={playerRef} updateCameraPosition={updateCameraPosition} />
      <Opponent />
      <StartLine ref={startRef} />
      <Dirt />
    </>
  )
}

export default Scene
