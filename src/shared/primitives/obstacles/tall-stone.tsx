import { useGLTF } from '@react-three/drei'
import React, { useMemo } from 'react'
import { Mesh } from 'three'

const TallStone = React.memo(() => {
  const { scene } = useGLTF('models/tall-stone.glb')
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse(child => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return <primitive object={clonedScene} />
})

export default TallStone
