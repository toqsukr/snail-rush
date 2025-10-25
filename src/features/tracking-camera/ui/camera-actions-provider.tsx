import { SpringRef, SpringValues, useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { PositionType, RotationType } from '../model/types'
import { useRapier } from '@react-three/rapier'
import { Vector3 } from 'three'

type TrackingCameraDeps = {
  initPosition: [number, number, number]
  initRotation: [number, number, number]
  targetHandle: number
  isFollowTarget: boolean
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
  targetHandle,
  isFollowTarget,
}) => {
  const { camera } = useThree()
  const { world } = useRapier()
  const [spring, api] = useSpring<SpringSettings>(() => ({
    position: initPosition,
    rotation: initRotation,
  }))

  const cameraPosition: [number, number, number] = initPosition
  const cameraPositionVector = new Vector3(...cameraPosition)
  const targetPosition = new Vector3(0, 0, 0)

  useFrame((_, delta) => {
    if (isFollowTarget) {
      const { x, y, z } = world.getRigidBody(targetHandle).translation()
      cameraPosition[0] = x
      cameraPosition[1] = y + 25
      cameraPosition[2] = z + 15
      targetPosition.set(x, y, z)
      cameraPositionVector.set(...cameraPosition)
      camera.position.lerp(cameraPositionVector, delta * 2)
      camera.lookAt(targetPosition.lerp(camera.position, delta * 2))
      spring.position.set(cameraPosition)
    } else {
      camera.position.set(...spring.position.get())
      camera.rotation.set(...spring.rotation.get())
      // camera.zoom = spring.zoom.get()
    }
  })

  const trackData = { spring, api }

  return <trackCameraContext.Provider value={trackData}>{children}</trackCameraContext.Provider>
}
