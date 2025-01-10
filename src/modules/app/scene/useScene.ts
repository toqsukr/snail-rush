import { useAppState } from '@modules/gameplay/store'
import { useSpring } from '@react-spring/three'
import { useRef } from 'react'
import { Object3D, PerspectiveCamera as PerspectiveCameraType, Vector3 } from 'three'
import { calcRotation, getGlobalPosition } from '../util'
import { SpringSettings } from './Scene.type.d'

export const useScene = () => {
  const playerRef = useRef<Object3D>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)
  const startRef = useRef<Object3D>(null)

  const { started, onGameStart } = useAppState()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 28, -15],
    rotation: [-Math.PI, 0, -Math.PI],
  }))

  const handleStart = () => {
    if (!started && playerRef.current && cameraRef.current) {
      const playerPosition = getGlobalPosition(playerRef.current)

      const targetPosition: [number, number, number] = [playerPosition.x, 22, playerPosition.z - 11]

      const targetRotation = calcRotation(
        new Vector3(...targetPosition),
        playerPosition,
        cameraRef.current.matrixWorld
      )

      api.start({
        to: next => {
          next({
            position: targetPosition,
            onRest: onGameStart,
            config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
          }).catch(() => {}),
            next({
              rotation: targetRotation,
              config: { mass: 1, tension: 50, friction: 40 },
            }).catch(() => {})
        },
      })
    }
  }

  const updateCameraPosition = (targetPosition: Vector3) => {
    const { x, y, z } = targetPosition

    api.start({
      position: [x, y + 22, z - 11],
      config: { mass: 1, tension: 50, friction: 40 },
    })
  }

  return { playerRef, cameraRef, startRef, handleStart, spring, updateCameraPosition }
}
