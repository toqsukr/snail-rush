import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'

export const useCollision = (ref: React.MutableRefObject<RapierRigidBody | null>) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()

  return (event: CollisionEnterPayload) => {
    const { other } = event
    const targetUserData = other.rigidBody?.userData
    if (shouldHandleCollision(targetUserData)) {
      console.log('Столкновение с препятствием!')
      const linvel = ref.current?.linvel()
      const vector = linvel ? new Vector3(linvel.x, linvel.y, linvel.z) : new Vector3()
      const normalized = vector.normalize().multiplyScalar(10)
      ref.current?.setLinvel(normalized, true)
      onCollision?.()
    }
  }
}
