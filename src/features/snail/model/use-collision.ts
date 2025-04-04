import { CollisionEnterPayload } from '@react-three/rapier'
import { useSnailDeps } from '../deps'

export const useCollision = () => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()

  return (event: CollisionEnterPayload) => {
    const { other } = event
    const targetUserData = other.rigidBody?.userData
    if (shouldHandleCollision(targetUserData)) {
      console.log('Столкновение с препятствием!')
      onCollision?.()
    }
  }
}
