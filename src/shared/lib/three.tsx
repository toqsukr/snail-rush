import { RigidBody } from '@react-three/rapier'

export const Floor = () => {
  return (
    <>
      <RigidBody
        type='fixed'
        position={[30, -0.1, -30]}
        colliders='cuboid'
        rotation={[Math.PI / 2, 0, 0]}
        args={[250, 250, 250]}>
        <mesh>
          <planeGeometry args={[250, 250, 250]} />
          <meshStandardMaterial color='black' />
        </mesh>
      </RigidBody>
    </>
  )
}
