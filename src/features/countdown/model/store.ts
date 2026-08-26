import { create } from 'zustand'

type CountdownStore = {
  startAt: number | null
  startTimer: (startAt: number) => void
  resetTimer: () => void
}

export const useCountdownStore = create<CountdownStore>(set => ({
  startAt: null,
  startTimer: startAt => set({ startAt }),
  resetTimer: () => set({ startAt: null }),
}))
