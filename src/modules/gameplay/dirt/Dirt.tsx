import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const Dirt = () => {
  const { scene } = useGLTF('models/dirt/dirt.glb')
  const modelRef = useRef<THREE.Object3D>(null)

  return <primitive object={scene} ref={modelRef} />
}

export default Dirt
