import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { PositionType, RotationType } from '../model/types'
import { useTrack } from '../model/use-track'

type TrackCameraProvider = {
  position: PositionType
  rotation: RotationType
  moveTo: (position: PositionType) => void
  focusTo: (position: Vector3) => void
  followTarget: (position: Vector3) => Promise<void>
}

export const trackCameraContext = createStrictContext<TrackCameraProvider>()

export const useTrackCameraContext = () => useStrictContext(trackCameraContext)

export const TrackCameraProvider: FC<PropsWithChildren> = ({ children }) => {
  const trackData = useTrack()

  return <trackCameraContext.Provider value={trackData}>{children}</trackCameraContext.Provider>
}
