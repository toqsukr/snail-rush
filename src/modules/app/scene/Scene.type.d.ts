import { Euler } from 'three'

export type SpringSettings = {
  position: [number, number, number]
  rotation: [number, number, number, Euler['order']?]
}
