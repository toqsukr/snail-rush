import { RigidBody } from '@react-three/rapier'

export const Floor = () => {
  return (
    <RigidBody
      type='fixed'
      position={[30, -0.1, -30]}
      colliders='cuboid'
      rotation={[Math.PI / 2, 0, 0]}
      args={[250, 250, 250]}>
      <mesh>
        <ambientLight intensity={3} color='white' />
        <directionalLight intensity={3} position={[10, 10, 10]} castShadow />
        <directionalLight intensity={3} position={[-10, 10, -10]} castShadow />
        <planeGeometry args={[250, 250, 250]} />
        <meshStandardMaterial color='black' />
      </mesh>
    </RigidBody>
  )
}
