import { PerspectiveCamera } from '@react-three/drei'
import { useTrackCameraContext } from './camera-actions-provider'

export const TrackingCamera = () => {
  const { position, rotation } = useTrackCameraContext()

  return <PerspectiveCamera makeDefault position={position} rotation={rotation} />
}
