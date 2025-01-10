import { PlayerStatus } from '@modules/lobby/type'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { calcAnimationDuration, getModel } from '../util'

export const usePositionAnimation = (
  mode: PlayerStatus,
  status: PlayerStatus,
  animationIdx?: number
) => {
  const opponentModel = useGLTF('animations/full-jump-static-opponent.glb')
  const playerModel = useGLTF('animations/full-jump-static.glb')

  const mixerRef = useRef<AnimationMixer | null>(null)
  const model = getModel(mode, status, playerModel, opponentModel)

  const getAnimationDuration = (koef: number) => {
    return calcAnimationDuration(model.animations[animationIdx ?? 0].duration ?? 0, koef)
  }

  const animatePosition = (animationDuration: number) => {
    if (!mixerRef.current) return

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
