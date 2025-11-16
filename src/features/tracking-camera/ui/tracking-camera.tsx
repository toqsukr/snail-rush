import { PerspectiveCamera } from '@react-three/drei'
import { DeviceType, useDeviceDetection } from '@shared/lib/device'

const deviceZoom: Record<DeviceType, number> = {
  desktop: 0.85,
  mobile: 1.15,
  tablet: 1,
}

export const TrackingCamera = () => {
  const device = useDeviceDetection()

  return <PerspectiveCamera makeDefault zoom={deviceZoom[device]} />
}
