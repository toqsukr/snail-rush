import { useSpring } from '@react-spring/three'
import { useRef } from 'react'
import * as THREE from 'three'
import { usePositionAnimation } from '../jump-animation/usePositionAnimation'
import { calcIntermediatePosition, calcTargetPosition } from '../util'

export const useSnailJump = (modelPath: string, startPosition?: [number, number, number]) => {
  const modelRef = useRef<THREE.Object3D>(null)

  const { animatePosition, getAnimationDuration, isAnimationRunning, model } =
    usePositionAnimation(modelPath)

  const [springProps, api] = useSpring(() => ({
    position: startPosition ?? [0, 0, 0],
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const triggerJump = (koef: number) => {
    const currentPosition = springProps.position.get()

    const targetPosition = calcTargetPosition(currentPosition, koef)

    const intermediatePosition = calcIntermediatePosition(currentPosition, targetPosition)

    animatePosition(koef)

    api.start({
      to: async next => {
        await next({
          position: intermediatePosition,
          config: { duration: getAnimationDuration(koef) * 220 },
        })
        await next({
          position: targetPosition,
          config: { duration: getAnimationDuration(koef) * 220 },
        })
      },
    })
  }

  return {
    isJumping: isAnimationRunning,
    modelRef,
    model,
    triggerJump,
    position: springProps.position.to((x, y, z) => [x, y, z]),
  }
}
