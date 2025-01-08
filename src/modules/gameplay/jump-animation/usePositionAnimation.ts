import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { calcAnimationDuration } from '../util'

export const usePositionAnimation = (modelPath: string, animationIdx?: number) => {
  const model = useGLTF(modelPath)
  const mixerRef = useRef<AnimationMixer | null>(null)

  const getAnimationDuration = (koef: number) => {
    return calcAnimationDuration(model.animations[animationIdx ?? 0].duration ?? 0, koef)
  }

  const animatePosition = (koef: number) => {
    if (!mixerRef.current) return

    const animationDuration = getAnimationDuration(koef)

    const currentAnimation = model.animations[animationIdx ?? 0]

    const action = mixerRef.current.clipAction(currentAnimation).setDuration(animationDuration)

    action.play()

    setTimeout(() => {
      action.stop()
    }, animationDuration * 1000)
  }

  const isAnimationRunning = () =>
    !!mixerRef.current?.clipAction(model.animations[animationIdx ?? 0]).isRunning()

  useEffect(() => {
    mixerRef.current = new AnimationMixer(model.scene)

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [model])

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
  })

  return { model, animatePosition, getAnimationDuration, isAnimationRunning }
}
