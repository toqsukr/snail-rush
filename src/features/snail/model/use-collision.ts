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

const horizontal = (x: number, z: number) => new Vector3(x, 0, z)

const contactPoint = (event: BouncePayload) => {
  if (event.manifold?.numSolverContacts()) return event.manifold.solverContactPoint(0)
  return event.other?.rigidBody?.translation()
}

const retreatFromContact = (event: BouncePayload) => {
  const snail = event.target.rigidBody?.translation()
  const contact = contactPoint(event)
  if (!snail || !contact) return null
  const away = horizontal(snail.x - contact.x, snail.z - contact.z)
  if (away.length() <= HORIZONTAL_EPSILON) return null
  return away.normalize()
}

const orientedNormal = (event: BouncePayload, approach: Vector3) => {
  if (!event.manifold) return null
  const { x, z } = event.manifold.normal()
  const axis = horizontal(x, z)
  if (axis.length() <= HORIZONTAL_EPSILON) return null
  axis.normalize()
  if (approach.length() > HORIZONTAL_EPSILON) {
    return axis.dot(approach) > 0 ? axis.negate() : axis
  }
  const retreat = retreatFromContact(event)
  if (retreat && axis.dot(retreat) < 0) return axis.negate()
  return axis
}

const bounceDirection = (event: BouncePayload, approach: Vector3) => {
  const fromNormal = orientedNormal(event, approach)
  if (fromNormal) return fromNormal
  const fromContact = retreatFromContact(event)
  if (fromContact) return fromContact
  const reversed = horizontal(-approach.x, -approach.z)
  if (reversed.length() > HORIZONTAL_EPSILON) return reversed.normalize()
  return null
}

export const calculateBounce = (
  event: BouncePayload,
  approach: Vector3,
  obstacleType?: RigidBodyTypeString,
) => {
  const direction = bounceDirection(event, approach)
  if (!direction) return null
  let multiplier = useSnailParams.getState().bounceMultiplier
  if (obstacleType === 'kinematicPosition' || obstacleType === 'kinematicVelocity') {
    multiplier *= useSnailParams.getState().dynamicObstacleMultiplier
  }
  const spread = useSnailParams.getState().bounceJitter
  const jitter = new Vector3((Math.random() - 0.5) * spread, 0, (Math.random() - 0.5) * spread)
  return direction.add(jitter).multiplyScalar(multiplier)
}

export const useCollision = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  animateCollision: () => void,
  stopAllAnimation: () => void,
) => {
  const { onCollision, shouldHandleCollision } = useSnailDeps()
  const { updatePosition, getIsStuning } = useSnailContext()

  const lastBounceRef = useRef(0)

  const bounce = (event: BouncePayload) => {
    if (!rigidBodyRef.current) return
    const approach = rigidBodyRef.current.linvel()
    const obstacleType = event.other?.rigidBody?.isKinematic() ? 'kinematicPosition' : 'fixed'
    const impulse = calculateBounce(event, new Vector3(approach.x, 0, approach.z), obstacleType)
    if (!impulse) return
    lastBounceRef.current = Date.now()
    if (!getIsStuning()) {
      stopAllAnimation()
      animateCollision()
    }
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    rigidBodyRef.current.applyImpulse(impulse, true)
    const { x, y, z } = rigidBodyRef.current.translation()
    const position = new Vector3(x, y, z)
    updatePosition(position)
    onCollision?.({ position, impulse })
  }

  const enter = (event: BouncePayload) => {
    if (!shouldHandleCollision(event.other?.rigidBody?.userData)) return
    if (Date.now() - lastBounceRef.current < useSnailParams.getState().collisionCooldown) return
    bounce(event)
  }

  return { enter }
}
