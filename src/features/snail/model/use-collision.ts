import { CollisionEnterPayload } from '@react-three/rapier'
import { useSnailDeps } from '../deps'

export const useCollision = (animateCollision: () => void) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()

  return (event: CollisionEnterPayload) => {
    const targetUserData = event.other.rigidBody?.userData
    if (shouldHandleCollision(targetUserData)) {
      console.log('Столкновение с препятствием!')
      animateCollision()
      onCollision?.()
    }
  }
}
