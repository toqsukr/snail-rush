import { useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'
import { useSnailContext } from '../ui/snail-provider'
import { useAnimation } from './use-animation'

const MAX_JUMP_LENGTH = 6

const MIN_JUMP_LENGTH = 2

const MAX_ANIMATION_DURATION = 1

const MIN_ANIMATION_DURATION = 0.5

const calcJumpDistance = (koef: number) => {
  return Math.max(MIN_JUMP_LENGTH, koef * MAX_JUMP_LENGTH)
}

const calculateLandingPosition = (
  position: THREE.Vector3,
  rotation: THREE.Euler,
  distance: number
) => {
  const localDirection = new THREE.Vector3(0, 0, -1)

  const quaternion = new THREE.Quaternion().setFromEuler(rotation)

  localDirection.applyQuaternion(quaternion)

  const newPosition = position.clone().addScaledVector(localDirection, distance)

  return newPosition
}

/**
 * Хук описывающий логику вращения и перемещения улиток
 *
 * Управляет как анимацией, так и физической составляющей
 */

export const useJump = () => {
  const { modelPath, startPosition } = useSnailDeps()

  const model = useGLTF(modelPath)
  const { animate, isAnimationRunning } = useAnimation(model)
  const {
    sequentialPosition,
    sequentialRotation,
    updatePosition,
    updateRotation,
    updateIsAnimating,
  } = useSnailContext()

  const rigidBodyRef = useRef<RapierRigidBody | null>(null)

  const [springProps, springAPI] = useSpring(() => ({
    position: startPosition ?? [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const getRotation = () => {
    return springProps.rotation.get()
  }

  const triggerRotate = (rotateY: number) => {
    const currentRotation = getRotation()

    console.log(rotateY)

    springAPI.start({
      rotation: [currentRotation[0], rotateY, currentRotation[2]],
      config: { duration: 0 },
      onChange: ({ value }) => {
        if (rigidBodyRef.current) {
          const quaternion = new THREE.Quaternion()
          quaternion.setFromEuler(new THREE.Euler(...value.rotation))
          rigidBodyRef.current.setRotation(quaternion, true)
        }
        console.log(value.rotation)
        updateRotation(value.rotation)
      },
    })
  }

  const triggerJump = (targetPosition: THREE.Vector3, duration: number) => {
    animate(duration)
    if (rigidBodyRef.current) {
      const rigidBody = rigidBodyRef.current

      const currentPosition = rigidBody.translation()
      const direction = new THREE.Vector3()
        .subVectors(targetPosition, currentPosition)
        .normalize()
        .multiplyScalar(duration * 16)

      rigidBody.setLinvel(direction, true)
    }
  }

  //TODO
  useFrame(() => {
    updateIsAnimating(isAnimationRunning(0))
  })

  useEffect(() => {
    if (rigidBodyRef.current) {
      const position = springProps.position.get()
      const rotation = springProps.rotation.get()

      rigidBodyRef.current.setTranslation(new THREE.Vector3(...position), true)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromEuler(new THREE.Euler(...rotation))
      rigidBodyRef.current.setRotation(quaternion, true)
    }

    const interval = setInterval(() => {
      if (rigidBodyRef.current) {
        const rigidBody = rigidBodyRef.current
        const position = rigidBody.translation()

        springAPI.start({
          position: [position.x, position.y, position.z],
          onChange: ({ value }) => {
            updatePosition(new THREE.Vector3(...value.position))
          },
        })
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const subscriptionPosition = sequentialPosition.subscribe(position => {
      const { x, y, z, duration } = position
      triggerJump(new THREE.Vector3(x, y, z), duration)
    })

    const subscriptionRotation = sequentialRotation.subscribe(rotation => {
      const { pitch } = rotation
      triggerRotate(pitch)
    })

    return () => {
      subscriptionPosition.unsubscribe()
      subscriptionRotation.unsubscribe()
    }
  }, [])

  return { model, rigidBodyRef }
}

export const useCalcTargetPosition = (position: Vector3, rotation: number[]) => {
  return (koef: number) => {
    const distance = calcJumpDistance(koef)

    const targetPosition = calculateLandingPosition(
      position,
      new THREE.Euler(Math.PI - rotation[0], -rotation[1], rotation[2]),
      distance
    )

    return targetPosition
  }
}

export const useCalcAnimationDuration = () => {
  const { modelPath } = useSnailDeps()
  const model = useGLTF(modelPath)

  return (index: number, koef: number) => {
    if (!modelPath) return 0

    return Math.min(
      Math.max(MIN_ANIMATION_DURATION, koef * model.animations[index].duration),
      MAX_ANIMATION_DURATION
    )
  }
}
