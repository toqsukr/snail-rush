import { useThree } from '@react-three/fiber'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { useTrackCameraContext } from '../ui/camera-actions-provider'

const calcRotation = (position: Vector3, targetPosition: Vector3) => {
  const matrix = new Matrix4()

  matrix.lookAt(position, targetPosition, new Vector3(0, 1, 0))

  const targetQuaternion = Quaternion.prototype.setFromRotationMatrix(matrix)

  const euler = Euler.prototype.setFromQuaternion(targetQuaternion, 'YXZ')

  return [euler.x, euler.y, euler.z]
}

export const useGetFocusToConfig = () => {
  const { camera } = useThree()
  return (focusPosition: Vector3, targetCameraPosition?: Vector3) => {
    const cameraPosition = targetCameraPosition ?? new Vector3(...camera.position)

    const targetRotation = calcRotation(cameraPosition, focusPosition)

    return {
      rotation: targetRotation,
      config: { mass: 1, tension: 50, friction: 40, duration: 1400 },
    }
  }
}

export const useFocusTo = () => {
  const getFocusToConfig = useGetFocusToConfig()
  const { api } = useTrackCameraContext()

  return (position: Vector3) => {
    return new Promise<void>(resolve =>
      api.start({
        to: async next => {
          await next(getFocusToConfig(position))
          resolve()
        },
      })
    )
  }
}
