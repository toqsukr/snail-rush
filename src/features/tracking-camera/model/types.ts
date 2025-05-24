export type PositionType = [x: number, y: number, z: number]

export type RotationType = [roll: number, pitch: number, yaw: number]

export type SpringSettings = {
  position: PositionType
  rotation: RotationType
  zoom: number
}
