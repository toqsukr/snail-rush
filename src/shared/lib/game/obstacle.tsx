import { useGLTF } from '@react-three/drei'
import { memo, useMemo } from 'react'
import { Mesh } from 'three'
import { RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, ReactNode } from 'react'

export const Stone = memo(({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse(child => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return <primitive object={clonedScene} />
})

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
    <RigidBody
      {...props}
      type='fixed'
      colliders='cuboid'
      restitution={1}
      userData={{ isObstacle: true }}>
      {model}
    </RigidBody>
  )
}
