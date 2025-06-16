import { useTrackCameraContext } from '../ui/camera-actions-provider'

export const useZoomTo = () => {
  const { api } = useTrackCameraContext()
  const getZoomToConfig = (zoom: number) => {
    return {
      zoom,
      config: { mass: 1, tension: 20, friction: 40, duration: 700 },
    }
  }

  return (zoom: number) => {
    return new Promise<void>(resolve =>
      api.start({
        to: async next => {
          await next(getZoomToConfig(zoom))
          resolve()
        },
      })
    )
  }
}
