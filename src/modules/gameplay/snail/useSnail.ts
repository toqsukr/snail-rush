import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export const useSnail = (path: string) => {
  const model = useGLTF(path)
  const modelRef = useRef<THREE.Object3D>(null)

  return { modelRef, model }
}
