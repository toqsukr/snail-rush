import { useGLTF } from '@react-three/drei'
import { PrimitiveProps } from '@react-three/fiber'
import { FC } from 'react'

const StartLine: FC<Omit<PrimitiveProps, 'object'>> = props => {
  const { scene } = useGLTF('models/start-line.glb')

  return <primitive {...props} object={scene} />
}

export default StartLine
