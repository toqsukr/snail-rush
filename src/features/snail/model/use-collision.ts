import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'

export const useCollision = (
  getRigidBody: () => RapierRigidBody | null,
  animateCollision: () => void
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()

  return (event: CollisionEnterPayload) => {
    const { other } = event
    const targetUserData = other.rigidBody?.userData
    if (shouldHandleCollision(targetUserData)) {
      console.log('Столкновение с препятствием!')
      animateCollision()
      const linvel = getRigidBody()?.linvel()
      const vector = linvel ? new Vector3(linvel.x, linvel.y, linvel.z) : new Vector3()
      const normalized = vector.normalize().multiplyScalar(10)
      getRigidBody()?.setLinvel(normalized, true)
      onCollision?.()
    }
  }
}
