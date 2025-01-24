import { calcRotation } from '@modules/app/util'
import { useAppState } from '@modules/gameplay/store'
import { usePlayerData } from '@modules/player/store'
import { useSpring } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Vector3 } from 'three'
import { SpringSettings } from './MainScene.type'

export const useMainScene = () => {
  const { onCountDown, started, moveable } = useAppState()
  const { camera } = useThree()
  const { initPosition } = usePlayerData()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: [0, 28, -15],
    rotation: [-Math.PI, 0, -Math.PI],
  }))

  const handleStart = () => {
    const targetPosition: [number, number, number] = [initPosition.x, 22, initPosition.z - 11]

    const targetRotation = calcRotation(
      new Vector3(...targetPosition),
      initPosition,
      camera.matrixWorld
    )

    api.start({
      to: next => {
        next({
          position: targetPosition,
          config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
        }).catch(() => {}),
          next({
            rotation: targetRotation,
            config: { mass: 1, tension: 50, friction: 40 },
          }).catch(() => {})
      },
    })
  }

  const updateCameraPosition = (targetPosition: Vector3) => {
    const { x, y, z } = targetPosition

    api.start({
      position: [x, y + 22, z - 11],
      config: { mass: 1, tension: 50, friction: 40 },
    })
  }

  const onStartRecieve = () => {
    handleStart()
    setTimeout(() => onCountDown(), 2000)
  }

  useEffect(() => {
    if (started && !moveable) {
      onStartRecieve()
    }
  }, [started])

  return { spring, updateCameraPosition, handleStart }
}
