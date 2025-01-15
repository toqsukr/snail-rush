import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'

const Dirt = () => {
  const { scene } = useGLTF('models/dirt/dirt.glb')
  const modelRef = useRef<THREE.Object3D>(null)

  return (
    <RigidBody colliders='hull' position={[0, 0, 0]}>
      <primitive object={scene} ref={modelRef} />
    </RigidBody>
  )
}

export default Dirt
