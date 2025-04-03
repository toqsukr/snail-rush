import { useSpring } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import { SpringSettings } from './types'

import { Euler, Matrix4, Object3D, Object3DEventMap, Vector3 } from 'three'
import { useTrackingCameraDeps } from '../deps'

export const getGlobalRotation = (matrixWorld: Matrix4) => {
  const rotationMatrix = new Matrix4()
  rotationMatrix.extractRotation(matrixWorld)

  const euler = new Euler()
  euler.setFromRotationMatrix(rotationMatrix)
  const { x, y, z } = euler

  return { x, y, z }
}

export const getGlobalPosition = (object: Object3D<Object3DEventMap>) => {
  const cameraVector = new Vector3()
  object.getWorldPosition(cameraVector)

  return cameraVector
}

export const calcRotation: (
  objectPosition: Vector3,
  targetPosition: Vector3,
  objectRotation?: Matrix4
) => [number, number, number] = (objectPosition, targetPosition, objectRotation) => {
  const camera = objectPosition.toArray()
  const target = targetPosition.toArray()
  const direction = [target[0] - camera[0], target[1] - camera[1], target[2] + 8 - camera[2]]
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2)
  const [dx, dy, dz] = direction.map(v => v / length)

  const cameraRotation = getGlobalRotation(objectRotation ?? new Matrix4())
  const newYaw = Math.atan2(dx, dz) + cameraRotation.y
  const newPitch = -Math.asin(dy) + cameraRotation.x
  const newRoll = cameraRotation.z

  return [newPitch, newYaw, newRoll]
}

export const useTrack = () => {
  const { camera } = useThree()
  const { initPosition, initRotation, playerInitPosition } = useTrackingCameraDeps()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: initPosition,
    rotation: initRotation,
  }))

  const initFocus = () => {
    const targetPosition: [number, number, number] = [
      playerInitPosition.x,
      30,
      playerInitPosition.z - 10,
    ]

    const targetRotation = calcRotation(
      new Vector3(...targetPosition),
      playerInitPosition,
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

  const followTarget = (targetPosition: Vector3) => {
    const { x, y, z } = targetPosition

    api.start({
      position: [x, y + 30, z - 10],
      config: { mass: 1, tension: 50, friction: 40 },
    })
  }

  return { spring, followTarget, initFocus }
}
