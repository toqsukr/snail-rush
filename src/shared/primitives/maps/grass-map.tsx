import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const GrassMap = () => {
  const mapPlane = useGLTF('models/compressed_grass-map.glb')
  const mapWalls = useGLTF('models/grass-walls.glb')

  return (
    <>
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
