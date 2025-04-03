import { create } from 'zustand'

type CountdownStore = {
  value: number
  running: boolean
  updateValue: (value: number) => void
  updateRunning: (running: boolean) => void
}

export const useCountdownStore = create<CountdownStore>((set, get) => ({
  value: 0,
  running: false,
  updateRunning: running => set({ ...get(), running }),
  updateValue: value => set({ ...get(), value }),
}))
