import { Object3D } from 'three'

export const modelInstance = (scene: Object3D) => {
  const instance = scene.clone()
  instance.visible = true
  return instance
}
