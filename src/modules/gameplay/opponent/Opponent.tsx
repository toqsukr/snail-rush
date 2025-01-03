import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { DirectionalLight, Object3D } from 'three'
import Snail from '../snail/Snail'

const Opponent = () => {
  const modelRef = useRef<Object3D>(null)
  const lightRef = useRef<DirectionalLight>(null)

  useFrame(() => {
    if (modelRef.current) {
      const modelPosition = modelRef.current.position
      lightRef.current?.lookAt(modelPosition)
    }
  })

  return <Snail ref={modelRef} modelPath='models/snail/snail-opponent.glb' />
}

export default Opponent
