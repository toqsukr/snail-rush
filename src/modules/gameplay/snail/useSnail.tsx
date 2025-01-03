import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const useSnail = () => {
  const model = useGLTF('models/snail/snail-shrink.glb')
  // const model = useFBX('models/snail/snail-shrink.fbx')
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const jumpDuration = 1.3 // Длительность прыжка (в секундах)
  const startTime = useRef(0)
  const modelRef = useRef<THREE.Object3D>(null)
  const { scene, animations } = model

  useEffect(() => {
    if (!scene || !animations.length) return

    mixer.current = new THREE.AnimationMixer(scene)
    return () => {
      mixer.current?.stopAllAction()
    }
  }, [scene, animations])

  const triggerJump = () => {
    if (!mixer.current || animations.length === 0) return

    const jumpAction = mixer.current.clipAction(animations[0])
    if (!jumpAction.isRunning()) {
      jumpAction.reset().play()
      startTime.current = performance.now()

      setTimeout(() => {
        if (modelRef.current) modelRef.current.position.z += 4
        jumpAction.stop()
      }, jumpDuration * 1000)
    }
  }

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta)
  })

  return { modelRef, model, triggerJump }
}
