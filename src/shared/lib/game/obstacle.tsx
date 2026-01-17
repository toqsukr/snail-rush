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
  extremePositions: [Vector3, Vector3]
} & Omit<RigidBodyProps, 'position'>

export const ChopperObstacle = forwardRef<RapierRigidBody | null, DynamicObstacleProp>(
  ({ model, extremePositions, speed = 5, rotateSpeed = Math.PI, ...props }, ref) => {
    const bodyRef = useRef<RapierRigidBody | null>(null)
    const rotationRef = useRef(new Euler(0, 0, 0))
    const isForward = useRef(true)
    const currentPosition = useRef(extremePositions[0].clone())

    useImperativeHandle(ref, () => bodyRef.current!, [])

    useFrame((_, delta) => {
      const moveDistance = speed * delta
      const target = isForward.current ? extremePositions[1] : extremePositions[0]

      // направление на текущую цель
      const moveDir = new Vector3().subVectors(target, currentPosition.current)
      const distanceToTarget = moveDir.length()

      if (distanceToTarget <= moveDistance) {
        // достигли точки — переключаем направление
        isForward.current = !isForward.current
        currentPosition.current.copy(target)
      } else {
        // двигаемся к цели
        moveDir.normalize().multiplyScalar(moveDistance)
        currentPosition.current.add(moveDir)
      }

      bodyRef.current?.setNextKinematicTranslation(currentPosition.current)
    })

    useFrame((_, delta) => {
      rotationRef.current.y += rotateSpeed * delta

      if (bodyRef.current) {
        const q = new Quaternion().setFromEuler(rotationRef.current)
        bodyRef.current.setNextKinematicRotation(q)
      }
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
