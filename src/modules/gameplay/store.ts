import { Subject } from 'rxjs'
import { create } from 'zustand'
import { AppState, OpponentStreamType } from './type'

export const useAppState = create<AppState>((set, get) => ({
  started: false,
  onWin: () => set({ ...get(), started: false }),
  onGameOver: () => set({ ...get(), started: false }),
  onGameStart: () => set({ ...get(), started: true }),
}))

export const opponentStream = new Subject<OpponentStreamType>()
