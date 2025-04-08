import { create } from 'zustand'

export type SnailStore = {
  position: number[]
  rotation: number[]
  isJumping: boolean
  startShrinkAnimation: (() => void) | null
  stopShrinkAnimation: (() => void) | null
  updateStartShrinkAnimation: (cb: () => void) => void
  updateStopShrinkAnimation: (cb: () => void) => void
  updatePosition: (position: number[]) => void
  updateRotation: (rotation: number[]) => void
  updateIsJumping: (isJumping: boolean) => void
}

export const createSnailStore = (initPosition: number[], initRotation: number[]) => {
  return create<SnailStore>((set, get) => ({
    position: initPosition,
    rotation: initRotation,
    isJumping: false,
    startShrinkAnimation: null,
    stopShrinkAnimation: null,
    updateStartShrinkAnimation: startShrinkAnimation => set({ ...get(), startShrinkAnimation }),
    updateStopShrinkAnimation: stopShrinkAnimation => set({ ...get(), stopShrinkAnimation }),
    updatePosition: position => set({ ...get(), position }),
    updateRotation: rotation => set({ ...get(), rotation }),
    updateIsJumping: isJumping => set({ ...get(), isJumping }),
  }))
}
