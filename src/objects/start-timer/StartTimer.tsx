import { useGLTF } from '@react-three/drei'
import { PrimitiveProps } from '@react-three/fiber'
import { FC } from 'react'

const StartTimer: FC<Omit<PrimitiveProps, 'object'>> = props => {
  const model = useGLTF('animations/start-timer.glb')

  return <primitive {...props} object={model.scene} />
}

export default StartTimer
