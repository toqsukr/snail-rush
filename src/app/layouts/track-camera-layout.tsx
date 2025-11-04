import { TrackCameraProvider } from '@features/tracking-camera'
import { useGameStore } from '@pages/home/model/store'
import { FC, PropsWithChildren } from 'react'

const cameraStartPosition = [16.1, 35, 5] satisfies [number, number, number]
const cameraStartRotation = [0, 0, 0] satisfies [number, number, number]

const TrackCameraLayout: FC<PropsWithChildren> = ({ children }) => {
  const { started, finished, pause, playerModelHandle } = useGameStore()
  const cameraDeps = {
    initPosition: cameraStartPosition,
    initRotation: cameraStartRotation,
    isFollowTarget: started && !pause && !finished,
    targetHandle: playerModelHandle,
  }
  return <TrackCameraProvider {...cameraDeps}>{children}</TrackCameraProvider>
}

export default TrackCameraLayout
