import { TrackCameraProvider } from '@features/tracking-camera'
import { FC, PropsWithChildren } from 'react'

const cameraStartPosition = [16.1, 35, 5]
const cameraStartRotation = [0, 0, 0]

const TrackCameraLayout: FC<PropsWithChildren> = ({ children }) => {
  const cameraDeps = {
    initPosition: cameraStartPosition,
    initRotation: cameraStartRotation,
  }
  return <TrackCameraProvider {...cameraDeps}>{children}</TrackCameraProvider>
}

export default TrackCameraLayout
