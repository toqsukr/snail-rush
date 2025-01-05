import Dirt from '@modules/gameplay/dirt/Dirt'
import Menu from '@modules/gameplay/menu/Menu'
import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import { useSpring } from '@react-spring/three'
import { PerspectiveCamera } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Object3D, PerspectiveCamera as PerspectiveCameraType } from 'three'

const Scene = () => {
  const playerRef = useRef<Object3D>(null)
  const menuRef = useRef<Object3D>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)

  const [_, api] = useSpring(() => ({
    position: [0, 14, -14],
    rotation: [-Math.PI, 0, -Math.PI],
    config: { mass: 1, tension: 30, friction: 40, frequency: 8 },
  }))

  const handleStart = () => {
    if (playerRef.current && cameraRef.current) {
      const camera = cameraRef.current.position.toArray().map(value => value)
      const target = playerRef.current.position.toArray().map(value => value)
      const direction = [target[0] - camera[0], target[1] - camera[1], target[2] + 8 - camera[2]]

      const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2)
      const [dx, dy, dz] = direction.map(v => v / length)

      const newYaw = Math.atan2(dx, dz)
      const newPitch = -Math.asin(dy) + cameraRef.current.rotation.x
      const newRoll = cameraRef.current.rotation.z

      api.start({
        position: [0, 11, -11],
        rotation: [newPitch, newYaw, newRoll],
        onChange: ({ value }) => {
          if (cameraRef.current) {
            cameraRef.current.rotation.set(value.rotation[0], value.rotation[1], value.rotation[2])
            cameraRef.current.position.set(value.position[0], value.position[1], value.position[2])
          }
        },
      })
    }
  }

  useEffect(() => {
    if (cameraRef.current && menuRef.current) {
      const { x, y, z } = menuRef.current.position
      cameraRef.current.lookAt(x, y, z)
    }
  }, [])

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 14, -14]} />
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <Menu ref={menuRef} handleStart={handleStart} />
      <Player ref={playerRef} />
      <Opponent />
      <Dirt />
    </>
  )
}

export default Scene
