import { useGLTF } from '@react-three/drei'
import { PrimitiveProps, useFrame } from '@react-three/fiber'
import { FC, Suspense, useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { useCountdownStore } from '../model/store'
import { useCountdownDeps } from './countdown-provider'

type CountdownProp = Omit<PrimitiveProps, 'object'>

export const Countdown: FC<CountdownProp> = props => {
  const { started, value, updateValue } = useCountdownStore()
  const { startValue, onAlarm, playerPosition } = useCountdownDeps()

  const isRunning = useRef(false)

  const model = useGLTF('models/start-timer.glb')

  const mixerRef = useRef<AnimationMixer | null>(null)

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
  })

  useEffect(() => {
    mixerRef.current = new AnimationMixer(model.scene)
    if (!mixerRef.current) return

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [model])

  useEffect(() => {
    if (started && !isRunning.current) {
      updateValue(startValue)
      isRunning.current = true
      const currentAnimation = model.animations[0]

      const action = mixerRef.current?.clipAction(currentAnimation)

      action?.play()

      const timeout = setTimeout(() => {
        updateValue(value - 1)
        if (value === 0) {
          isRunning.current = false
          onAlarm()
        }
      }, startValue * 1000)

      return () => clearTimeout(timeout)
    }
  }, [started])

  const position = [playerPosition[0], playerPosition[1] + 8, playerPosition[2]]

  if (!isRunning.current) return

  return (
    <Suspense fallback={null}>
      <primitive {...props} object={model.scene} position={position} />
    </Suspense>
  )
}
