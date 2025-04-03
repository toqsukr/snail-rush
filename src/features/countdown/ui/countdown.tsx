import { useGLTF } from '@react-three/drei'
import { PrimitiveProps, useFrame } from '@react-three/fiber'
import { FC, Suspense, useEffect, useRef } from 'react'
import { AnimationMixer } from 'three'
import { useCountdownDeps } from '../deps'
import { useCountdownStore } from '../model/store'

type CountdownProp = Omit<PrimitiveProps, 'object'>

export const Countdown: FC<CountdownProp> = props => {
  const { value, running, updateRunning, updateValue } = useCountdownStore()
  const { startValue, onAlarm, playerPosition } = useCountdownDeps()

  const model = useGLTF('animations/start-timer.glb')

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
    if (!running) {
      updateValue(startValue)
      const currentAnimation = model.animations[0]

      const action = mixerRef.current?.clipAction(currentAnimation)

      action?.play()

      const timeout = setTimeout(() => {
        updateValue(value - 1)
        if (value === 0) {
          updateRunning(false)
          onAlarm()
        }
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [running])

  const position = [playerPosition[0], playerPosition[1] + 8, playerPosition[2]]

  return (
    <Suspense fallback={null}>
      <primitive {...props} object={model.scene} position={position} />
    </Suspense>
  )
}
