import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'
import {
  ConvexHullCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier'
import { FC, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { chopperPosition } from './chopper-path'

export const isObstacle = (targetModelUserData: unknown) => {
  if (!targetModelUserData) return false

  if (typeof targetModelUserData !== 'object') return false

  if (!('isObstacle' in targetModelUserData)) return false

  if (typeof targetModelUserData.isObstacle !== 'boolean') return false

  return targetModelUserData.isObstacle
}

type StaticObstacleProp = {
  model: ReactNode
} & RigidBodyProps

export const StaticObstacle: FC<StaticObstacleProp> = ({ model, ...props }) => {
  return (
    <RigidBody {...props} type='fixed' colliders='trimesh' userData={{ isObstacle: true }}>
      {model}
    </RigidBody>
  )
}

const elapsedSince = (startedAt?: number) =>
  startedAt ? Math.max(0, (Date.now() - startedAt) / 1000) : 0

type DynamicObstacleProp = {
  model: ReactNode
  speed?: number
  rotateSpeed?: number
  startedAt?: number
  extremePositions: [Vector3, Vector3]
} & Omit<RigidBodyProps, 'position'>

export const ChopperObstacle = forwardRef<RapierRigidBody | null, DynamicObstacleProp>(
  ({ model, extremePositions, speed = 5, rotateSpeed = Math.PI, startedAt, ...props }, ref) => {
    const bodyRef = useRef<RapierRigidBody | null>(null)
    const rotationRef = useRef(new Euler(0, 0, 0))
    const [spawn] = useState(() =>
      chopperPosition(elapsedSince(startedAt), extremePositions, speed),
    )

    useImperativeHandle(ref, () => bodyRef.current!, [])

    useFrame(() => {
      if (!startedAt) return
      const elapsed = elapsedSince(startedAt)
      bodyRef.current?.setNextKinematicTranslation(
        chopperPosition(elapsed, extremePositions, speed),
      )
      rotationRef.current.y = (rotateSpeed * elapsed) % (2 * Math.PI)
      bodyRef.current?.setNextKinematicRotation(new Quaternion().setFromEuler(rotationRef.current))
    })

    const vertices = useMemo(
      () =>
        new Float32Array([
          ...Array.from({ length: 5 }, (_, arm) => ((-19 + 72 * arm) * Math.PI) / 180).flatMap(
            angle =>
              [0.05, 0.5].flatMap(height => [2.4 * Math.cos(angle), height, 2.4 * Math.sin(angle)]),
          ),
          0,
          -4,
          0,
        ]),
      [],
    )

    return (
      <RigidBody
        {...props}
        ref={bodyRef}
        position={spawn}
        type='kinematicPosition'
        colliders={false}
        userData={{ isObstacle: true }}
        collisionGroups={interactionGroups(0b01, 0b10)}>
        <ConvexHullCollider sensor name='chopper' args={[vertices]} />
        {model}
      </RigidBody>
    )
  },
)
