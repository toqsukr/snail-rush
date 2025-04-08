import { ObjectMap, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { GLTF } from 'three-stdlib'

/**
 * Хук для управления анимациями модели .glb
 *
 * @param model модель в формате .glb
 * @returns animate - функция для проигрывания анимации с указанием продолжительности
 * @returns getAnimationDuration - функция для получения исходной продолжительности анимации
 * @returns isAnimationRunning - функция, возвращает true если анимация еще проигрывается
 */

export const useAnimation = (model: GLTF & ObjectMap) => {
  const mixerRef = useRef<AnimationMixer | null>(null)

  const getAnimationDuration = (animationIdx?: number) => {
    return model.animations[animationIdx ?? 0].duration ?? 0
  }

  const animate = (animationIdx?: number, animationDuration?: number) => {
    if (!mixerRef.current) return

    const currentAnimation = model.animations[animationIdx ?? 0]

    const duration = animationDuration ?? getAnimationDuration(animationIdx)

    const action = mixerRef.current.clipAction(currentAnimation).setDuration(duration)

    action.play()

    setTimeout(() => {
      action.stop()
    }, duration * 1000)
  }

  const isAnimationRunning = (animationIdx?: number) =>
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

  return { animate, getAnimationDuration, isAnimationRunning }
}
