import { create } from 'zustand'
import { MAX_SPACE_HOLD_TIME } from '@shared/config/game'
import { MAX_INCREMENT, MIN_INCREMENT, STEP } from './constants'

type ControlParams = {
  minIncrement: number
  maxIncrement: number
  step: number
  maxSpaceHoldTime: number
  updateMinIncrement: (minIncrement: number) => void
  updateMaxIncrement: (maxIncrement: number) => void
  updateStep: (step: number) => void
  updateMaxSpaceHoldTime: (maxSpaceHoldTime: number) => void
}

export const useControlParams = create<ControlParams>((set, get) => ({
  minIncrement: MIN_INCREMENT,
  maxIncrement: MAX_INCREMENT,
  step: STEP,
  maxSpaceHoldTime: MAX_SPACE_HOLD_TIME,
  updateMinIncrement: minIncrement => set({ ...get(), minIncrement }),
  updateMaxIncrement: maxIncrement => set({ ...get(), maxIncrement }),
  updateStep: step => set({ ...get(), step }),
  updateMaxSpaceHoldTime: maxSpaceHoldTime => set({ ...get(), maxSpaceHoldTime }),
}))
