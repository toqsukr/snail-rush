import { create } from 'zustand'

type CountdownStore = {
  value: number
  running: boolean
  started: boolean
  updateValue: (value: number) => void
  updateStarted: (started: boolean) => void
  updateRunning: (running: boolean) => void
}

export const useCountdownStore = create<CountdownStore>((set, get) => ({
  value: 0,
  started: false,
  running: false,
  updateStarted: started => set({ ...get(), started }),
  updateRunning: running => set({ ...get(), running }),
  updateValue: value => set({ ...get(), value }),
}))
