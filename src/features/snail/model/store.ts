import { Vector3 } from 'three'
import { create } from 'zustand'

type SnailStore = {
  position: Vector3
  rotation: number[]
  isAnimating: boolean
  updatePosition: (position: Vector3) => void
  updateRotation: (rotation: number[]) => void
  updateIsAnimating: (isAnimating: boolean) => void
}

export const useSnailStore = create<SnailStore>((set, get) => ({
  position: new Vector3(),
  rotation: [0, 0, 0],
  isAnimating: false,
  updatePosition: position => set({ ...get(), position }),
  updateRotation: rotation => set({ ...get(), rotation }),
  updateIsAnimating: isAnimating => set({ ...get(), isAnimating }),
}))
