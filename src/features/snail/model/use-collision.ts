import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'

export const useCollision = (
  getRigidBody: () => RapierRigidBody | null,
  animateCollision: () => void
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()

  return (event: CollisionEnterPayload) => {
    const { manifold, other } = event
    const targetUserData = other.rigidBody?.userData
    if (shouldHandleCollision(targetUserData)) {
      console.log('Столкновение с препятствием!')
      animateCollision()

      const { x, y, z } = manifold.normal()

      const normal = new Vector3(x, y, z)

      const FORCE_MAGNITUDE = 10
      const BOUNCE_FACTOR = 0.7

      const {
        x: impulseX,
        y: impulseY,
        z: impulseZ,
      } = normal.multiplyScalar(FORCE_MAGNITUDE * BOUNCE_FACTOR)

      getRigidBody()?.setLinvel({ x: impulseX, y: impulseY, z: impulseZ }, true)

      onCollision?.()
    }
  }
}
