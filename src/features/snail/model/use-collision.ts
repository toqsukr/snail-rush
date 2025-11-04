import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'
import { BOUNCE_MULTIPLIER } from './constants'
import { RefObject } from 'react'
import { useSnailContext } from '../ui/snail-provider'

export const calculateBounce = (event: CollisionEnterPayload) => {
  const { x, z } = event.manifold.normal()
  return new Vector3(x, 0, z)
    .addScaledVector(new Vector3((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1), 1)
    .multiplyScalar(BOUNCE_MULTIPLIER)
}

export const useCollision = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  animateCollision: () => void,
  stopAllAnimation: () => void
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()
  const { updatePosition } = useSnailContext()

  return (event: CollisionEnterPayload) => {
    const obstacle = event.other.rigidBody
    if (shouldHandleCollision(obstacle?.userData)) {
      console.log('Столкновение с препятствием!')
      stopAllAnimation()
      animateCollision()

      if (rigidBodyRef.current) {
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

        const bounceImpulse = calculateBounce(event)
        rigidBodyRef.current?.applyImpulse(bounceImpulse, true)
        const { x, y, z } = rigidBodyRef.current.translation()
        updatePosition(new Vector3(x, y, z))
      }

      onCollision?.()
    }
  }
}
