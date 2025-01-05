import { create } from 'zustand'
import { AppState } from './type'

export const useAppState = create<AppState>((set, get) => ({
  started: false,
  onWin: () => set({ ...get(), started: false }),
  onGameOver: () => set({ ...get(), started: false }),
  onGameStart: () => set({ ...get(), started: true }),
}))
