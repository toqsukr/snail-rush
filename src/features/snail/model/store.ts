import { create } from 'zustand'
import { RotationType } from './types'

export type SnailStore = {
  rotation: RotationType['rotation']
  startShrinkAnimation: (() => void) | null
  stopShrinkAnimation: (() => void) | null
  updateStartShrinkAnimation: (cb: () => void) => void
  updateStopShrinkAnimation: (cb: () => void) => void
  updateRotation: (rotation: RotationType['rotation']) => void
}

export const createSnailStore = (initRotation: RotationType['rotation']) => {
  return create<SnailStore>((set, get) => ({
    rotation: initRotation,
    startShrinkAnimation: null,
    stopShrinkAnimation: null,
    updateStartShrinkAnimation: startShrinkAnimation => set({ ...get(), startShrinkAnimation }),
    updateStopShrinkAnimation: stopShrinkAnimation => set({ ...get(), stopShrinkAnimation }),
    updateRotation: rotation => set({ ...get(), rotation }),
  }))
}
