import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const GrassWalls = () => {
  const { scene } = useGLTF('models/map1/walls1.glb')

  return (
    <RigidBody colliders='trimesh' type='fixed' position={[18, 0, -6]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </RigidBody>
  )
}

export default GrassWalls
