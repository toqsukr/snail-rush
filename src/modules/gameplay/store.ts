import { create } from 'zustand'
import { AppState, OpponentState } from './type'

export const useAppState = create<AppState>((set, get) => ({
  started: false,
  onWin: () => set({ ...get(), started: false }),
  onGameOver: () => set({ ...get(), started: false }),
  onGameStart: () => set({ ...get(), started: true }),
}))

export const useOppnentState = create<OpponentState>((set, get) => ({
  positionQueue: [],
  addPosition: position => set({ ...get(), positionQueue: [...get().positionQueue, position] }),
  popPosition: () => set({ ...get(), positionQueue: [...get().positionQueue.slice(1, -1)] }),
}))
