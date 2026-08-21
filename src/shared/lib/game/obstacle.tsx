import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'
import {
  CuboidCollider,
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
    <RigidBody {...props} type='fixed' colliders='cuboid' userData={{ isObstacle: true }}>
      {model}
    </RigidBody>
  )
}

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
    const mountedAt = useRef(Date.now())

    useImperativeHandle(ref, () => bodyRef.current!, [])

    useFrame(() => {
      const elapsed = (Date.now() - (startedAt || mountedAt.current)) / 1000
      bodyRef.current?.setNextKinematicTranslation(
        chopperPosition(elapsed, extremePositions, speed),
      )
      rotationRef.current.y = (rotateSpeed * elapsed) % (2 * Math.PI)
      bodyRef.current?.setNextKinematicRotation(
        new Quaternion().setFromEuler(rotationRef.current),
      )
    })

    return (
      <RigidBody
        {...props}
        ref={bodyRef}
        type='kinematicPosition'
        colliders={false}
        userData={{ isObstacle: true }}
        collisionGroups={interactionGroups(0b01, 0b10)}>
        <CuboidCollider
          sensor
          name='chopper'
          args={[1.8, 3, 1.8]}
          position={[0, -2, 0]}
          rotation={[0, Math.PI / 4, 0]}
        />
        {model}
      </RigidBody>
    )
  },
)
