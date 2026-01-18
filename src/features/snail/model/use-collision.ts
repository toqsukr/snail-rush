import { Vector3 } from 'three'
import { RefObject, useRef } from 'react'
import { CollisionEnterPayload, RapierRigidBody, RigidBodyTypeString } from '@react-three/rapier'
import { useSnailDeps } from '../deps'
import { BOUNCE_MULTIPLIER } from './constants'
import { useSnailContext } from '../ui/snail-provider'

const DYNAMIC_OBSTACLE_MULTIPLIER = 0.3
const STUN_DELAY = 0

export const calculateBounce = (
  event: CollisionEnterPayload,
  obstacleType?: RigidBodyTypeString,
) => {
  const { x, z } = event.manifold.normal()
  let multiplier = BOUNCE_MULTIPLIER
  if (obstacleType === 'kinematicPosition' || obstacleType === 'kinematicVelocity') {
    multiplier *= DYNAMIC_OBSTACLE_MULTIPLIER
  }
  return new Vector3(x, 0, z)
    .addScaledVector(new Vector3((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1), 1)
    .multiplyScalar(multiplier)
}

export const useCollision = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  animateCollision: () => void,
  stopAllAnimation: () => void,
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()
  const { updatePosition } = useSnailContext()

  const lastCollisionRef = useRef(0)

  return (event: CollisionEnterPayload) => {
    const now = Date.now()
    if (now - lastCollisionRef.current < STUN_DELAY) return

    const obstacle = event.other.rigidBody
    if (shouldHandleCollision(obstacle?.userData)) {
      lastCollisionRef.current = now
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
