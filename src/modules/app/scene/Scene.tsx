import Dirt from '@modules/gameplay/dirt/Dirt'
import Menu from '@modules/gameplay/menu/Menu'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import { animated, useSpring } from '@react-spring/three'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { Object3D, PerspectiveCamera as PerspectiveCameraType } from 'three'
import { calcRotation, getGlobalPosition } from '../util'
import { SpringSettings } from './Scene.type'

const Scene = () => {
  const playerRef = useRef<Object3D>(null)
  const menuRef = useRef<Object3D>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 14, -14],
    rotation: [-Math.PI, 0, -Math.PI],
    config: { mass: 1, tension: 30, friction: 40, duration: 2500 },
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
        position: [0, 11, -11],
        rotation: [...(Object.values(targetRotation) as SpringSettings['rotation'])],
      })
    }
  }

  const updateCameraPosition = () => {
    if (playerRef.current && cameraRef.current) {
      const cameraPosition = getGlobalPosition(cameraRef.current)
      const playerPosition = getGlobalPosition(playerRef.current)
      api.start({
        from: {
          position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
        },
        to: {
          position: [playerPosition.x, playerPosition.y + 11, playerPosition.z - 11],
        },
        config: {
          duration: 1500,
        },
      })
    }
  }

  return (
    <>
      <animated.group position={spring.position} rotation={spring.rotation as any}>
        <PerspectiveCamera makeDefault ref={cameraRef} />
      </animated.group>
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <Menu ref={menuRef} handleStart={handleStart} />
      <Player ref={playerRef} updateCameraPosition={updateCameraPosition} />
      <Opponent />
      <Dirt />
    </>
  )
}

export default Scene
