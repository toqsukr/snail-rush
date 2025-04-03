import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { Vector3 } from 'three'
import { PositionType, RotationType } from './model/types'

type TrackingCameraDeps = {
  initPosition: PositionType
  initRotation: RotationType
  playerInitPosition: Vector3
}

export const trackingCameraDepsContext = createStrictContext<TrackingCameraDeps>()

export const useTrackingCameraDeps = () => useStrictContext(trackingCameraDepsContext)
