import { useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody } from '@react-three/rapier'
import { useEffect } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { useSnailDeps } from '../deps'
import { useSnailContext } from '../ui/snail-provider'
import { PositionType, RotationType } from './types'

const MAX_JUMP_LENGTH = 8

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
  const localDirection = new THREE.Vector3(0, 0, 1)

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

export const useJump = (
  getRigidBody: () => RapierRigidBody | null,
  isJumpAnimating: () => boolean,
  animateJump: (duration: number) => void
) => {
  const {
    sequentialPosition,
    sequentialRotation,
    updatePosition,
    updateRotation,
    updateIsAnimating,
    position,
    rotation,
  } = useSnailContext()

  const [springProps, springAPI] = useSpring(() => ({
    position,
    rotation,
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const triggerRotate = (rotation: RotationType) => {
    const { duration, roll, pitch, yaw } = rotation
    const euler = [roll, pitch, yaw]
    springAPI.start({
      rotation: euler,
      config: { duration },
      onChange: ({ value }) => {
        const rigidBody = getRigidBody()

        if (rigidBody) {
          const quaternion = new THREE.Quaternion()
          quaternion.setFromEuler(new THREE.Euler(...value.rotation))
          rigidBody.setRotation(quaternion, true)
        }
        updateRotation(value.rotation)
      },
    })
  }

  const triggerJump = (position: PositionType) => {
    const { duration, x, y, z } = position
    const targetPosition = new Vector3(x, y, z)
    animateJump(duration)
    const rigidBody = getRigidBody()
    if (rigidBody) {
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
    updateIsAnimating(isJumpAnimating())
  })

  useEffect(() => {
    const rigidBody = getRigidBody()
    if (rigidBody) {
      const position = springProps.position.get()
      const rotation = springProps.rotation.get()

      rigidBody.setTranslation(new THREE.Vector3(...position), true)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromEuler(new THREE.Euler(...rotation))
      rigidBody.setRotation(quaternion, true)
    }

    const interval = setInterval(() => {
      const rigidBody = getRigidBody()
      if (rigidBody) {
        const position = rigidBody.translation()

        springAPI.start({
          position: [position.x, position.y, position.z],
          onChange: ({ value }) => updatePosition(value.position),
        })
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const subscriptionPosition = sequentialPosition.subscribe(position => {
      triggerJump(position)
    })

    const subscriptionRotation = sequentialRotation.subscribe(rotation => {
      triggerRotate(rotation)
    })

    return () => {
      subscriptionPosition.unsubscribe()
      subscriptionRotation.unsubscribe()
    }
  }, [])
}

export const useCalcTargetPosition = (position: Vector3, rotation: number[]) => {
  return (koef: number) => {
    const distance = calcJumpDistance(koef)

    const targetPosition = calculateLandingPosition(
      position,
      new THREE.Euler(rotation[0], rotation[1], rotation[2]),
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
