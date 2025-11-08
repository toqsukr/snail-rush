import { useGLTF } from '@react-three/drei'
import { PrimitiveProps } from '@react-three/fiber'
import { FC, useMemo } from 'react'
import { Mesh } from 'three'

type ModelPrimitiveProps = {
  modelPath: string
} & Omit<PrimitiveProps, 'object'>

export const ModelPrimitive: FC<ModelPrimitiveProps> = ({ modelPath, ...props }) => {
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

  return <primitive {...props} object={clonedScene} />
}
