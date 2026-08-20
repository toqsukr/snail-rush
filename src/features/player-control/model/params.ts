import { create } from 'zustand'
import { MAX_INCREMENT, MIN_INCREMENT, STEP } from './constants'

type ControlParams = {
  minIncrement: number
  maxIncrement: number
  step: number
  updateMinIncrement: (minIncrement: number) => void
  updateMaxIncrement: (maxIncrement: number) => void
  updateStep: (step: number) => void
}

export const useControlParams = create<ControlParams>((set, get) => ({
  minIncrement: MIN_INCREMENT,
  maxIncrement: MAX_INCREMENT,
  step: STEP,
  updateMinIncrement: minIncrement => set({ ...get(), minIncrement }),
  updateMaxIncrement: maxIncrement => set({ ...get(), maxIncrement }),
  updateStep: step => set({ ...get(), step }),
}))
