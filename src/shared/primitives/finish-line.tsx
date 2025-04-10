import { useGLTF } from '@react-three/drei'
import { PrimitiveProps } from '@react-three/fiber'
import { FC } from 'react'

const FinishLine: FC<Omit<PrimitiveProps, 'object'>> = props => {
  const { scene } = useGLTF('models/finish-line.glb')

  return <primitive {...props} object={scene} />
}

export default FinishLine
