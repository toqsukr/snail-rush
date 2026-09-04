import { useGLTF } from '@react-three/drei'
import { PrimitiveProps, useFrame } from '@react-three/fiber'
import { FC, Suspense, useEffect, useRef, useState } from 'react'
import { AnimationAction, AnimationMixer } from 'three'
import { CountdownPhase, countdownState } from '../lib/countdown-state'
import { useCountdownStore } from '../model/store'
import { useCountdownDeps } from './countdown-provider'

type CountdownProp = Omit<PrimitiveProps, 'object'>

export const Countdown: FC<CountdownProp> = props => {
  const { startAt } = useCountdownStore()
  const { duration, onAlarm, playerPosition } = useCountdownDeps()

  const [phase, setPhase] = useState<CountdownPhase>('pending')

  const model = useGLTF('models/start-timer.glb')

  const alarmedAt = useRef<number | null>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const actionRef = useRef<AnimationAction | null>(null)

  useEffect(() => {
    const mixer = new AnimationMixer(model.scene)
    mixerRef.current = mixer
    actionRef.current = mixer.clipAction(model.animations[0])
    actionRef.current.play()

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
      actionRef.current = null
    }
  }, [model])

  useFrame(() => {
    if (startAt === null) return
    const { phase: current, elapsed } = countdownState(Date.now(), startAt, duration)
    if (current !== phase) setPhase(current)
    if (current === 'running' && actionRef.current) {
      actionRef.current.time = (elapsed / duration) * actionRef.current.getClip().duration
      mixerRef.current?.update(0)
    }
    if (current === 'done' && alarmedAt.current !== startAt) {
      alarmedAt.current = startAt
      onAlarm()
    }
  })

  if (phase !== 'running') return

  return (
    <Suspense fallback={null}>
      <primitive
        {...props}
        object={model.scene}
        position={[playerPosition.x, playerPosition.y + 8, playerPosition.z]}
      />
    </Suspense>
  )
}
