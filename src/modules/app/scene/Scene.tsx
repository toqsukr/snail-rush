import Dirt from '@modules/gameplay/dirt/Dirt'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import Menu from '@modules/lobby/menu/Menu'
import { animated, useSpring } from '@react-spring/three'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { Object3D, PerspectiveCamera as PerspectiveCameraType } from 'three'
import { calcRotation, getGlobalPosition } from '../util'
import { SpringSettings } from './Scene.type.d'

const Scene = () => {
  const playerRef = useRef<Object3D>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 17, -15],
    rotation: [-Math.PI, 0, -Math.PI],
  }))

  const handleStart = () => {
    if (playerRef.current && cameraRef.current) {
      const cameraVector = getGlobalPosition(cameraRef.current)

      const targetRotation = calcRotation(
        cameraVector,
        playerRef.current.position,
        cameraRef.current.matrixWorld
      )

      api.start({
        rotation: targetRotation.toArray(),
        config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
      })

      api.start({
        position: [0, 11, -11],
        config: { mass: 1, tension: 50, friction: 40 },
      })
    }
  }

  const updateCameraPosition = () => {
    if (playerRef.current && cameraRef.current) {
      const cameraPosition = getGlobalPosition(cameraRef.current)
      const playerPosition = getGlobalPosition(playerRef.current)

      api.start({
        from: {
          position: cameraPosition.toArray(),
        },
        to: {
          position: [playerPosition.x, playerPosition.y + 11, playerPosition.z - 11],
        },
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
      <Menu handleStart={handleStart} />
      <Player ref={playerRef} updateCameraPosition={updateCameraPosition} />
      <Opponent />
      <Dirt />
    </>
  )
}

export default Scene
