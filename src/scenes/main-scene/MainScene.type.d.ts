import { Vector3 } from 'three'

export type SpringSettings = {
  position: PositionType
  rotation: RotationType
}

export type MainSceneContextType = {
  handleStart: () => void
  updateCameraPosition: (targetPosition: Vector3) => void
}
