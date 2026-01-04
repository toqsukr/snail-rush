import { PrimitiveProps } from '@react-three/fiber'
import { FC } from 'react'
import { ModelPrimitive } from './primitive'

const START_MODEL_PATH = 'models/compressed_start-line.glb'

export const StartModel: FC<Omit<PrimitiveProps, 'object'>> = props => {
  return <ModelPrimitive {...props} modelPath={START_MODEL_PATH} />
}
