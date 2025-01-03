import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const useSnailJump = () => {
  const model = useGLTF('animations/jump1.glb')
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const targetPosition = useRef(new THREE.Vector3())

  const modelRef = useRef<THREE.Object3D>(null)
  const { scene, animations } = model

  useEffect(() => {
    if (!scene || !animations.length) return

    mixerRef.current = new THREE.AnimationMixer(scene)

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [scene, animations])

  const triggerJump = () => {
    if (!mixerRef.current || !modelRef.current) return

    const jumpAction = mixerRef.current.clipAction(model.animations[0])
    if (!jumpAction.isRunning()) {
      targetPosition.current.copy(modelRef.current.position).add(new THREE.Vector3(0, 0, 4))

      jumpAction.reset().play()
      setTimeout(() => {
        jumpAction.stop()
      }, jumpAction.getClip().duration * 1000)
    }
  }

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)

    if (mixerRef.current && modelRef.current) {
      const jumpAction = mixerRef.current.clipAction(model.animations[0])
      const animationDuration = jumpAction.getClip().duration
      const currentTime = jumpAction.time

      const progress =
        Math.max(0, currentTime - 0.25 * animationDuration) / (0.75 * animationDuration)

      const interpolatedPosition = new THREE.Vector3().lerpVectors(
        modelRef.current.position,
        targetPosition.current,
        progress
      )

      modelRef.current.position.copy(interpolatedPosition)
    }
  })

  return { modelRef, model, triggerJump }
}
