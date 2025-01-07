import { Euler, Matrix4, Object3D, Object3DEventMap, Vector3 } from 'three'

export const getGlobalRotation = (matrixWorld: Matrix4) => {
  const rotationMatrix = new Matrix4()
  rotationMatrix.extractRotation(matrixWorld)

  const euler = new Euler()
  euler.setFromRotationMatrix(rotationMatrix)
  const { x, y, z } = euler

  return { x, y, z }
}

export const getGlobalPosition = (object: Object3D<Object3DEventMap>) => {
  const cameraVector = new Vector3()
  object.getWorldPosition(cameraVector)

  return cameraVector
}

export const calcRotation = (
  objectPosition: Vector3,
  targetPosition: Vector3,
  objectRotation?: Matrix4
) => {
  const camera = objectPosition.toArray()
  const target = targetPosition.toArray()
  const direction = [target[0] - camera[0], target[1] - camera[1], target[2] + 8 - camera[2]]
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2)
  const [dx, dy, dz] = direction.map(v => v / length)

  const cameraRotation = getGlobalRotation(objectRotation ?? new Matrix4())
  const newYaw = Math.atan2(dx, dz) + cameraRotation.y
  const newPitch = -Math.asin(dy) + cameraRotation.x
  const newRoll = cameraRotation.z

  return new Euler(newPitch, newYaw, newRoll)
}
