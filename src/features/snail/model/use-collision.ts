import { Vector3 } from 'three'
import { RefObject, useRef } from 'react'
import {
  CollisionEnterPayload,
  CollisionPayload,
  RapierRigidBody,
  RigidBodyTypeString,
} from '@react-three/rapier'
import { useSnailDeps } from '../deps'
import { useSnailParams } from './params'
import { useSnailContext } from '../ui/snail-provider'
import { HORIZONTAL_EPSILON } from './constants'

export type BouncePayload = CollisionPayload & { manifold?: CollisionEnterPayload['manifold'] }

const contactPoint = (event: BouncePayload) => {
  if (event.manifold?.numSolverContacts()) return event.manifold.solverContactPoint(0)
  return event.other?.rigidBody?.translation()
}

const awayFromContact = (event: BouncePayload, approach: Vector3) => {
  const snail = event.target.rigidBody?.translation()
  const contact = contactPoint(event)
  if (snail && contact) {
    const away = new Vector3(snail.x - contact.x, 0, snail.z - contact.z)
    if (away.length() > HORIZONTAL_EPSILON) return away.normalize()
  }
  const retreat = new Vector3(-approach.x, 0, -approach.z)
  if (retreat.length() > HORIZONTAL_EPSILON) return retreat.normalize()
  const { x, z } = event.manifold!.normal()
  return new Vector3(x, 0, z).normalize()
}

export const calculateBounce = (
  event: BouncePayload,
  approach: Vector3,
  obstacleType?: RigidBodyTypeString,
) => {
  let multiplier = useSnailParams.getState().bounceMultiplier
  if (obstacleType === 'kinematicPosition' || obstacleType === 'kinematicVelocity') {
    multiplier *= useSnailParams.getState().dynamicObstacleMultiplier
  }
  const spread = useSnailParams.getState().bounceJitter
  const jitter = new Vector3((Math.random() - 0.5) * spread, 0, (Math.random() - 0.5) * spread)
  return awayFromContact(event, approach).add(jitter).multiplyScalar(multiplier)
}

export const useCollision = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  animateCollision: () => void,
  stopAllAnimation: () => void,
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()
  const { updatePosition } = useSnailContext()

  const lastCollisionRef = useRef(0)
  const contactsRef = useRef(new Map<number, BouncePayload>())

  const bounce = (event: BouncePayload) => {
    const now = Date.now()
    if (now - lastCollisionRef.current < useSnailParams.getState().collisionCooldown) return
    lastCollisionRef.current = now
    stopAllAnimation()
    animateCollision()
    if (rigidBodyRef.current) {
      const approach = rigidBodyRef.current.linvel()
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      const obstacleType = event.other?.rigidBody?.isKinematic() ? 'kinematicPosition' : 'fixed'
      const bounceImpulse = calculateBounce(
        event,
        new Vector3(approach.x, 0, approach.z),
        obstacleType,
      )
      rigidBodyRef.current.applyImpulse(bounceImpulse, true)
      const { x, y, z } = rigidBodyRef.current.translation()
      const position = new Vector3(x, y, z)
      updatePosition(position)
      onCollision?.({ position, impulse: bounceImpulse })
    }
  }

  const enter = (event: BouncePayload) => {
    const obstacle = event.other?.rigidBody
    if (!shouldHandleCollision(obstacle?.userData)) return
    console.log('Столкновение с препятствием!')
    if (obstacle) contactsRef.current.set(obstacle.handle, { ...event, manifold: undefined })
    bounce(event)
  }

  const exit = (event: CollisionPayload) => {
    const obstacle = event.other?.rigidBody
    if (obstacle) contactsRef.current.delete(obstacle.handle)
  }

  const tick = () => {
    contactsRef.current.forEach((event, handle) => {
      if (!event.other?.rigidBody?.isValid()) return contactsRef.current.delete(handle)
      bounce(event)
    })
  }

  return { enter, exit, tick }
}
