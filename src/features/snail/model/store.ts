import { create } from 'zustand'
import { PositionType, RotationType } from './types'

export type SnailStore = {
  position: PositionType['impulse']
  rotation: RotationType['rotation']
  startShrinkAnimation: (() => void) | null
  stopShrinkAnimation: (() => void) | null
  updateStartShrinkAnimation: (cb: () => void) => void
  updateStopShrinkAnimation: (cb: () => void) => void
  updatePosition: (position: PositionType['impulse']) => void
  updateRotation: (rotation: RotationType['rotation']) => void
}

export const createSnailStore = (
  initPosition: PositionType['impulse'],
  initRotation: RotationType['rotation']
) => {
  return create<SnailStore>((set, get) => ({
    position: initPosition,
    rotation: initRotation,
    startShrinkAnimation: null,
    stopShrinkAnimation: null,
    updateStartShrinkAnimation: startShrinkAnimation => set({ ...get(), startShrinkAnimation }),
    updateStopShrinkAnimation: stopShrinkAnimation => set({ ...get(), stopShrinkAnimation }),
    updatePosition: position => set({ ...get(), position }),
    updateRotation: rotation => set({ ...get(), rotation }),
  }))
}
