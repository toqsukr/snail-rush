import { Group, Object3DEventMap } from 'three'

export type PositionAnimationProp = {
  object: Group<Object3DEventMap>
  position: [number, number, number]
}
