import { createStrictContext, useStrictContext } from '@shared/lib/react'

type TrackingCameraDeps = {
  initPosition: number[]
  initRotation: number[]
}

export const trackingCameraDepsContext = createStrictContext<TrackingCameraDeps>()

export const useTrackingCameraDeps = () => useStrictContext(trackingCameraDepsContext)
