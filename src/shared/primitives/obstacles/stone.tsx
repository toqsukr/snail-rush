import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

const Stone = () => {
  const { scene } = useGLTF('models/stone/stone.glb')

  const clonedScene = useMemo(() => scene.clone(), [scene])

  // const randomRotationY = useMemo(() => Math.random() * Math.PI * 2, [])

  return <primitive object={clonedScene} />
}

export default Stone
