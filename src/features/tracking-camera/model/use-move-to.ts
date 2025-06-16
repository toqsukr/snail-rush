import { useTrackCameraContext } from '../ui/camera-actions-provider'
import { PositionType } from './types'

export const getMoveToConfig = (position: PositionType) => {
  return {
    position,
    config: { mass: 1, tension: 20, friction: 40, duration: 2500 },
  }
}

export const useMoveTo = () => {
  const { api } = useTrackCameraContext()

  return (position: PositionType) => {
    return new Promise<void>(resolve =>
      api.start({
        to: async next => {
          await next(getMoveToConfig(position))
          resolve()
        },
      })
    )
  }
}
