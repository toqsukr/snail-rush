import { PlayerStatus } from '@modules/lobby/type'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { useAppState } from '../store'
import { getStartPosition } from '../util'

const StartTimer: FC<{ status: PlayerStatus }> = ({ status }) => {
  const model = useGLTF('animations/start-timer.glb')
  const { countdown, allowMoving } = useAppState()

  const mixerRef = useRef<AnimationMixer | null>(null)

  const playerPosition = getStartPosition(status, 'host')

  const position = [playerPosition[0], playerPosition[1] + 8, playerPosition[2]]

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

  return (
    <primitive object={model.scene} position={position} rotation={[-Math.PI / 8, Math.PI, 0]} />
  )
}

export default StartTimer
