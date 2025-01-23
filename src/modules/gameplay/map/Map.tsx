import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Object3D } from 'three'

const Map = () => {
  const { scene } = useGLTF('models/map1/map1.glb')
  const modelRef = useRef<Object3D>(null)

  return (
    <>
      <ambientLight intensity={5} color='white' />

      <directionalLight intensity={1} position={[10, 10, 10]} castShadow />
      <directionalLight intensity={1} position={[-10, 10, -10]} castShadow />

      <RigidBody colliders='trimesh' position={[18, 0, -6]} rotation={[0, Math.PI, 0]}>
        <primitive object={scene} ref={modelRef} />
      </RigidBody>
    </>
  )
}

export default Map
