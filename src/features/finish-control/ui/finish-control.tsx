import { Ray } from '@dimforge/rapier3d-compat'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  interactionGroups,
  RigidBody,
  RigidBodyProps,
  useRapier,
} from '@react-three/rapier'
import { FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { useFinishControl } from '../deps'

export const FinishControl: FC<PropsWithChildren<RigidBodyProps>> = ({ children, ...props }) => {
  const { onFinish } = useFinishControl()
  const { world } = useRapier()

  useFrame(() => {
    const rayStart = new Vector3(50, 0.2, -14)
    const rayEnd = new Vector3(65, 0.2, -7)

    const direction = new Vector3().subVectors(rayEnd, rayStart).normalize()

    const ray = new Ray(
      { x: rayStart.x, y: rayStart.y, z: rayStart.z },
      { x: direction.x, y: direction.y, z: direction.z }
    )

    const rayLength = rayStart.distanceTo(rayEnd)

    const hit = world.castRay(ray, rayLength, true)
    if (hit) {
      console.log('Финиш пересечен')
      onFinish(hit.collider.parent()?.userData)
    }
  })

  return (
    <RigidBody
      {...props}
      type='fixed'
      colliders={false}
      collisionGroups={interactionGroups(0b01, 0b10)}
      onCollisionEnter={({ rigidBody }) => onFinish(rigidBody?.userData)}>
      <CuboidCollider args={[1, 0.01, 10]} position={[-6, -0.1, 0]} sensor />
      {children}
    </RigidBody>
  )
}
