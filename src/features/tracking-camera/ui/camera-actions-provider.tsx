import { SpringRef, SpringValues, useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { PositionType, RotationType } from '../model/types'

type TrackingCameraDeps = {
  initPosition: number[]
  initRotation: number[]
}

type SpringSettings = {
  position: PositionType
  rotation: RotationType
  zoom: number
}

type TrackCameraProvider = {
  api: SpringRef<SpringSettings>
  spring: SpringValues<SpringSettings>
}

const trackCameraContext = createStrictContext<TrackCameraProvider>()

export const useTrackCameraContext = () => useStrictContext(trackCameraContext)

export const TrackCameraProvider: FC<PropsWithChildren<TrackingCameraDeps>> = ({
  children,
  initPosition,
  initRotation,
}) => {
  const { camera } = useThree()
  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: initPosition,
    rotation: initRotation,
  }))

  useFrame(() => {
    camera.position.set(...spring.position.get())
    camera.rotation.set(...spring.rotation.get())
    // camera.zoom = spring.zoom.get()
  })

  const trackData = { spring, api }

  return <trackCameraContext.Provider value={trackData}>{children}</trackCameraContext.Provider>
}
