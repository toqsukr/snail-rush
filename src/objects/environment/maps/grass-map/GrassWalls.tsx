import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const GrassWalls = () => {
  const { scene } = useGLTF('models/map1/walls1.glb')

  return (
    <RigidBody
      type='fixed'
      colliders='trimesh'
      rotation={[0, Math.PI, 0]}
      position={[18, 0, -6]}
      userData={{ isObstacle: true }}>
      <primitive object={scene} />
    </RigidBody>
  )
}

export default GrassWalls
