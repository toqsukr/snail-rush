import { useAppState } from '@modules/gameplay/store'
import { useLobby } from '@modules/lobby/store'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'

export const useStartTimer = () => {
  const { status } = useLobby()
  const { countdown, allowMoving } = useAppState()
  const model = useGLTF('animations/start-timer.glb')

  const mixerRef = useRef<AnimationMixer | null>(null)

  useEffect(() => {
    mixerRef.current = new AnimationMixer(model.scene)
    if (!mixerRef.current) return

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [model])

  useEffect(() => {
    if (countdown) {
      const currentAnimation = model.animations[0]

      const action = mixerRef.current?.clipAction(currentAnimation)

      action?.play()
      setTimeout(() => {
        action?.stop()
        allowMoving()
      }, currentAnimation.duration * 1000)
    }
  }, [countdown])

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
  })

  return { status, countdown }
}
