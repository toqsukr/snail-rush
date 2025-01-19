import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Object3D } from 'three'

const Stone = () => {
  const { scene } = useGLTF('models/stone/stone.glb')
  const modelRef = useRef<Object3D>(null)

  return (
    <RigidBody type='fixed' colliders='cuboid' position={[2, 0, 10]}>
      <primitive object={scene} ref={modelRef} />
    </RigidBody>
  )
}

export default Stone
