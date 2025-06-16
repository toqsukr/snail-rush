import { Vector3 } from 'three'
import { useTrackCameraContext } from '../ui/camera-actions-provider'
import { useGetFocusToConfig } from './use-focus-to'
import { getMoveToConfig } from './use-move-to'

export const useFollowTarget = () => {
  const { api } = useTrackCameraContext()
  const getFocusToConfig = useGetFocusToConfig()

  return (targetPosition: Vector3) => {
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
  }
}
