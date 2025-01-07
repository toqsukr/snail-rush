import { useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const useSnailJump = () => {
  const model = useGLTF('animations/full-jump-static.glb')
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const modelRef = useRef<THREE.Object3D>(null)
  const { scene, animations } = model

  const [springProps, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  useEffect(() => {
    if (!scene || !animations.length) return

    mixerRef.current = new THREE.AnimationMixer(scene)

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [scene, animations])

  const triggerJump = () => {
    if (!mixerRef.current) return

    const jumpAction = mixerRef.current.clipAction(model.animations[0])
    jumpAction.reset().play()

    const currentPosition = springProps.position.get()
    const intermediatePosition = [
      currentPosition[0],
      currentPosition[1] + 1.5,
      currentPosition[2] + 2,
    ]

    const targetPosition = [currentPosition[0], currentPosition[1], currentPosition[2] + 4]

    api.start({
      position: intermediatePosition,
      delay: jumpAction.getClip().duration * 280,
      config: { duration: jumpAction.getClip().duration * 220 },
    })

    api.start({
      position: targetPosition,
      delay: jumpAction.getClip().duration * 450,
      config: { duration: jumpAction.getClip().duration * 220 },
    })

    setTimeout(() => {
      jumpAction.stop()
    }, jumpAction.getClip().duration * 1000)
  }

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
  })

  return {
    isJumping: () => mixerRef.current?.clipAction(model.animations[0]).isRunning(),
    modelRef,
    model,
    triggerJump,
    position: springProps.position.to((x, y, z) => [x, y, z]),
  }
}
