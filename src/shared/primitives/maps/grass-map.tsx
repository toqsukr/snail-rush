import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const GrassMap = () => {
  const mapPlane = useGLTF('models/grass-map.glb')
  const mapWalls = useGLTF('models/grass-walls.glb')

  return (
    <>
      <ambientLight intensity={3} color='white' />
      <directionalLight intensity={3} position={[10, 10, 10]} castShadow />
      <directionalLight intensity={3} position={[-10, 10, -10]} castShadow />
      <RigidBody colliders='cuboid' type='fixed' position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <primitive object={mapPlane.scene} />
      </RigidBody>
      <RigidBody
        type='fixed'
        colliders='trimesh'
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        restitution={1}
        userData={{ isObstacle: true }}>
        <primitive object={mapWalls.scene} />
      </RigidBody>
    </>
  )
}

export default GrassMap
