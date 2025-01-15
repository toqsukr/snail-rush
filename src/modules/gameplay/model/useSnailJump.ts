import { PlayerStatus } from '@modules/lobby/type'
import { useSpring } from '@react-spring/three'
import { RapierRigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'
import { calcJumpDistance, calculateLandingPosition, getStartPosition } from '../util'
import { usePositionAnimation } from './useAnimation'

export const useSnailJump = (mode: PlayerStatus, status: PlayerStatus) => {
  const startPosition = getStartPosition(mode, status)

  const animationOptions = usePositionAnimation(mode, status)

  const { animatePosition, getAnimationDuration, isAnimationRunning, model } = animationOptions

  const rigidBodyRef = useRef<RapierRigidBody | null>(null)

  const [springProps, springAPI] = useSpring(() => ({
    position: startPosition ?? [0, 0, 0],
    rotation: [0, 0, 0],
    // onChange: ({ value }) => {
    //   if (rigidBodyRef.current) {
    //     positionVector.set(...(value.position as [number, number, number]))
    //     rigidBodyRef.current.setTranslation(positionVector, true)
    //   }
    // },
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const getRotation = () => {
    return springProps.rotation.get()
  }

  const triggerRotate = (rotateY: number) => {
    const currentRotation = getRotation()

    springAPI.start({
      rotation: [currentRotation[0], rotateY, currentRotation[2]],
      config: { duration: 0 },
    })
  }

  const calcTargetPosition = (koef: number) => {
    const currentPosition = springProps.position.get()
    const currentRotation = getRotation()

    const distance = calcJumpDistance(koef)

    const targetPosition = calculateLandingPosition(
      new THREE.Vector3(...currentPosition),
      new THREE.Euler(Math.PI - currentRotation[0], -currentRotation[1], currentRotation[2]),
      distance
    )

    return targetPosition
  }

  const triggerJump = (targetPosition: THREE.Vector3, duration: number) => {
    animatePosition(duration)

    springAPI.start({
      to: async next => {
        await next({
          position: targetPosition.toArray(),
          config: { duration: duration * 1000 },
        })
      },
    })
  }

  return {
    model,
    rigidBodyRef,
    getRotation,
    triggerJump,
    triggerRotate,
    calcTargetPosition,
    getAnimationDuration,
    isJumping: isAnimationRunning,
    rotation: springProps.rotation,
    position: springProps.position.to((x, y, z) => [x, y, z]),
  }
}
