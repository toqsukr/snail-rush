import { Group, Object3DEventMap, Vector3 } from 'three'

export type SnailProp = {
  geometry: Group<Object3DEventMap>
  texturePath: string
  position: Vector3
}
