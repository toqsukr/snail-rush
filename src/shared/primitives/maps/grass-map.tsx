import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const GrassMap = () => {
  const mapPlane = useGLTF('models/map1/map1.glb')
  const mapWalls = useGLTF('models/map1/walls1.glb')

  return (
    <>
      <ambientLight intensity={3} color='white' />
      <directionalLight intensity={3} position={[10, 10, 10]} castShadow />
      <directionalLight intensity={3} position={[-10, 10, -10]} castShadow />
      <RigidBody colliders='cuboid' type='fixed' position={[18, 0, -6]} rotation={[0, Math.PI, 0]}>
        <primitive object={mapPlane.scene} />
      </RigidBody>
      <RigidBody
        type='fixed'
        colliders='trimesh'
        rotation={[0, Math.PI, 0]}
        position={[18, 0, -6]}
        userData={{ isObstacle: true }}>
        <primitive object={mapWalls.scene} />
      </RigidBody>
    </>
  )
}

export default GrassMap
