import { create } from 'zustand'

export type SnailStore = {
  position: number[]
  rotation: number[]
  isAnimating: boolean
  updatePosition: (position: number[]) => void
  updateRotation: (rotation: number[]) => void
  updateIsAnimating: (isAnimating: boolean) => void
}

export const createSnailStore = (initPosition: number[], initRotation: number[]) => {
  return create<SnailStore>((set, get) => ({
    position: initPosition,
    rotation: initRotation,
    isAnimating: false,
    updatePosition: position => set({ ...get(), position }),
    updateRotation: rotation => set({ ...get(), rotation }),
    updateIsAnimating: isAnimating => set({ ...get(), isAnimating }),
  }))
}
