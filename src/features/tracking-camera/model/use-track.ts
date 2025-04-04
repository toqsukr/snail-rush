import { useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { PositionType, SpringSettings } from './types'

import { useCallback } from 'react'
import { Euler, Matrix4, Object3D, Object3DEventMap, Quaternion, Vector3 } from 'three'
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

const calcRotation = (objectPosition: Vector3, targetPosition: Vector3) => {
  const direction = new Vector3().subVectors(objectPosition, targetPosition).normalize()

  const targetQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), direction)

  const euler = new Euler().setFromQuaternion(targetQuaternion, 'XYZ')
  return [euler.x, euler.y, -Math.PI + euler.z]
}

export const useTrack = () => {
  const { camera } = useThree()
  const { initPosition, initRotation } = useTrackingCameraDeps()

  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: initPosition,
    rotation: initRotation,
  }))

  const getMoveToConfig = (position: PositionType) => {
    return {
      position: position,
      config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
    }
  }

  const getFocusToConfig = (focusPosition: Vector3, targetCameraPosition?: Vector3) => {
    const cameraPosition = targetCameraPosition ?? new Vector3(...camera.position)

    const targetRotation = calcRotation(cameraPosition, focusPosition)

    return {
      rotation: targetRotation,
      config: { mass: 1, tension: 50, friction: 40, duration: 1400 },
    }
  }

  const moveTo = useCallback((position: PositionType) => {
    api.start(getMoveToConfig(position))
  }, [])

  const focusTo = useCallback(
    (position: Vector3) => {
      api.start(getFocusToConfig(position))
    },
    [camera]
  )

  const followTarget = useCallback(
    (targetPosition: Vector3) => {
      const { x, y, z } = targetPosition.round()

      const targetCameraPosition = new Vector3(x, y + 25, z - 15)

      return new Promise<void>(resolve =>
        api.start({
          to: async next => {
            await Promise.all([
              next(getMoveToConfig(targetCameraPosition.toArray())).catch(() => {}),
              next(getFocusToConfig(targetPosition, targetCameraPosition)).catch(() => {}),
            ])
            resolve()
          },
        })
      )
    },
    [camera]
  )

  useFrame(() => {
    camera.position.set(...spring.position.get())
    camera.rotation.set(...spring.rotation.get())
  })

  return {
    position: spring.position.get(),
    rotation: spring.rotation.get(),
    followTarget,
    moveTo,
    focusTo,
  }
}
