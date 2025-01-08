import { useSpring } from '@react-spring/three'
import { useRef } from 'react'
import * as THREE from 'three'
import { usePositionAnimation } from '../jump-animation/usePositionAnimation'
import { calcJumpDistance, calculateLandingPosition } from '../util'

export const useSnailJump = (modelPath: string, startPosition?: [number, number, number]) => {
  const modelRef = useRef<THREE.Object3D>(null)

  const { animatePosition, getAnimationDuration, isAnimationRunning, model } =
    usePositionAnimation(modelPath)

  const [springProps, api] = useSpring(() => ({
    position: startPosition ?? [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const triggerRotate = (rotateY: number) => {
    const currentRotation = springProps.rotation.get()

    api.start({
      rotation: [currentRotation[0], currentRotation[1] + rotateY, currentRotation[2]],
      config: { duration: 0 },
    })
  }

  const triggerJump = (koef: number) => {
    const currentPosition = springProps.position.get()
    const currentRotation = springProps.rotation.get()

    const distance = calcJumpDistance(koef)

    const targetPosition = calculateLandingPosition(
      new THREE.Vector3(...currentPosition),
      new THREE.Euler(Math.PI - currentRotation[0], -currentRotation[1], currentRotation[2]),
      distance
    )

    animatePosition(koef)

    api.start({
      to: async next => {
        await next({
          position: targetPosition.toArray(),
          config: { duration: getAnimationDuration(koef) * 220 },
        })
      },
    })
  }

  return {
    model,
    modelRef,
    triggerJump,
    triggerRotate,
    isJumping: isAnimationRunning,
    rotation: springProps.rotation,
    position: springProps.position.to((x, y, z) => [x, y, z]),
  }
}
