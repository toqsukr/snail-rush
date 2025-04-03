import { PerspectiveCamera } from '@react-three/drei'
import { useTrack } from '../model/use-track'

export const TrackingCamera = () => {
  const { spring } = useTrack()

  return (
    <PerspectiveCamera
      makeDefault
      position={spring.position.get()}
      rotation={spring.rotation.get()}
    />
  )
}
