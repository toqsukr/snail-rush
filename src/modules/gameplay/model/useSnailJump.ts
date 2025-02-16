import { useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PlayerPositions, PlayerSkins } from '../type'
import {
  calcAnimationDuration,
  calcJumpDistance,
  calculateLandingPosition,
  getModelPath,
  getStartPosition,
} from '../util'
import { useAnimation } from './useAnimation'

/**
 * Хук описывающий логику вращения и перемещения улиток
 *
 * Управляет как анимацией, так и физической составляющей
 *
 * @param playerPosition начальная позиция данного игрока
 * @param skin скин данного игрока
 *
 * @returns position - параметр перемещения (для анимации react-spring)
 * @returns rotation - параметр вращения (для анимации react-spring)
 * @returns triggerJump - функция, запускающая перемещение модели
 * @returns triggerRotate - функция, запускающая вращение модели
 * @returns isJumping - флаг, равен true, пока анимация активна
 * @returns getRotation - функция получения текущего глобального угла вращения модели
 * @returns getAnimationDuration - функция получения продолжительности анимации перемещения
 * @returns calcTargetPosition - функция для расчета целевой позиции перемещения
 */

export const useSnailJump = (playerPosition: PlayerPositions, skin: PlayerSkins) => {
  const model = useGLTF(getModelPath(skin))
  const startPosition = getStartPosition(playerPosition)
  const animationOptions = useAnimation(model)

  const { animate, isAnimationRunning } = animationOptions

  const rigidBodyRef = useRef<RapierRigidBody | null>(null)

  const [springProps, springAPI] = useSpring(() => ({
    position: startPosition ?? [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 300, friction: 40 },
  }))

  const getRotation = () => {
    return springProps.rotation.get()
  }

  const getAnimationDuration = (koef: number) => {
    return calcAnimationDuration(animationOptions.getAnimationDuration(), koef)
  }

  const triggerRotate = (rotateY: number) => {
    const currentRotation = getRotation()

    springAPI.start({
      rotation: [currentRotation[0], rotateY, currentRotation[2]],
      config: { duration: 0 },
      onChange: ({ value }) => {
        if (rigidBodyRef.current) {
          const quaternion = new THREE.Quaternion()
          quaternion.setFromEuler(new THREE.Euler(...value.rotation))
          rigidBodyRef.current.setRotation(quaternion, true)
        }
      },
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
        })
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

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
