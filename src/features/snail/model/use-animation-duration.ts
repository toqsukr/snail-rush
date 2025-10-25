import { useGLTF } from '@react-three/drei'

export const useCalcAnimationDuration = () => {
  const model = useGLTF('/models/snail.glb')
  return (index: number) => {
    return model.animations[index].duration * 0.5
  }
}
