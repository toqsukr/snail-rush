import { RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, ReactNode } from 'react'

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
    <RigidBody {...props} userData={{ isObstacle: true }} type='fixed' colliders='cuboid'>
      {model}
    </RigidBody>
  )
}
