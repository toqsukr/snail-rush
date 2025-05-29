import { useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback } from 'react'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { useTrackingCameraDeps } from '../deps'
import { PositionType, SpringSettings } from './types'

const calcRotation = (position: Vector3, targetPosition: Vector3) => {
  const matrix = new Matrix4()

  matrix.lookAt(position, targetPosition, new Vector3(0, 1, 0))

  const targetQuaternion = Quaternion.prototype.setFromRotationMatrix(matrix)

  const euler = Euler.prototype.setFromQuaternion(targetQuaternion, 'YXZ')

  return [euler.x, euler.y, euler.z]
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
      position,
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

  const getZoomToConfig = (zoom: number) => {
    return {
      zoom,
      config: { mass: 1, tension: 20, friction: 40, duration: 700 },
    }
  }

  const zoomTo = useCallback((zoom: number) => {
    return new Promise<void>(resolve =>
      api.start({
        to: async next => {
          await next(getZoomToConfig(zoom))
          resolve()
        },
      })
    )
  }, [])

  const moveTo = useCallback((position: PositionType) => {
    return new Promise<void>(resolve =>
      api.start({
        to: async next => {
          await next(getMoveToConfig(position))
          resolve()
        },
      })
    )
  }, [])

  const focusTo = useCallback(
    (position: Vector3) => {
      return new Promise<void>(resolve =>
        api.start({
          to: async next => {
            await next(getFocusToConfig(position))
            resolve()
          },
        })
      )
    },
    [camera]
  )

  const followTarget = useCallback(
    (targetPosition: Vector3) => {
      const { x, y, z } = targetPosition.round()

      const targetCameraPosition = new Vector3(x, y + 25, z + 15)

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
    // camera.zoom = spring.zoom.get()
  })

  return {
    followTarget,
    moveTo,
    focusTo,
    zoomTo,
  }
}
