import { RigidBody } from '@react-three/rapier'
import { useCollision } from '../model/use-collision'
import { useJump } from '../model/use-jump'

export const Snail = () => {
  const { rigidBodyRef, model } = useJump()
  const handleCollision = useCollision()

  return (
    <RigidBody
      ref={rigidBodyRef}
      type='dynamic'
      enabledRotations={[false, false, false]}
      linearDamping={1.5}
      friction={0.5}
      onCollisionEnter={handleCollision}
      colliders='cuboid'>
      <primitive object={model.scene} />
    </RigidBody>
  )
}
