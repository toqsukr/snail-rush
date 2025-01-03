import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { PerspectiveCamera as Camera, DirectionalLight, Object3D } from 'three'
import SnailJump from '../snail-jump/SnailJump'

const Player = () => {
  const modelRef = useRef<Object3D>(null)
  const cameraRef = useRef<Camera>(null)
  const lightRef = useRef<DirectionalLight>(null)

  useFrame(() => {
    if (modelRef.current) {
      const modelPosition = modelRef.current.position
      const { x, y, z } = modelPosition
      cameraRef.current?.position.set(x, y + 14, z - 14)
      cameraRef.current?.lookAt(modelPosition)
      lightRef.current?.lookAt(modelPosition)
    }
  })

  return (
    <>
      <directionalLight ref={lightRef} position={[0, 1, -1]} intensity={6} />
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 14, -14]} />
      <SnailJump ref={modelRef} />
    </>
  )
}

export default Player
