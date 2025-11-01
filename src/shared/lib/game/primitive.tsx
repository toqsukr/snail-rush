import { useGLTF } from '@react-three/drei'
import { PrimitiveProps } from '@react-three/fiber'
import { FC } from 'react'

type ModelPrimitiveProps = {
  modelPath: string
} & Omit<PrimitiveProps, 'object'>

export const ModelPrimitive: FC<ModelPrimitiveProps> = ({ modelPath, ...props }) => {
  const { scene } = useGLTF(modelPath)

  return <primitive {...props} object={scene} />
}
