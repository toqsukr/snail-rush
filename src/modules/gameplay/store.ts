import { Subject } from 'rxjs'
import { create } from 'zustand'
import { AppState, OpponentPositionType, OpponentRotationType } from './type.d'

export const useAppState = create<AppState>((set, get) => ({
  started: false,
  moveable: false,
  finished: false,
  pause: false,
  countdown: false,
  winnerID: null,
  setWinner: winnerID => set({ ...get(), winnerID }),
  onCountDown: () => set({ ...get(), countdown: true }),
  allowMoving: () => set({ ...get(), moveable: true, countdown: false }),
  onGameOver: () => set({ ...get(), started: false, moveable: false, finished: true }),
  onGameStart: () => set({ ...get(), started: true }),
  onPauseGame: () => set({ ...get(), pause: true, moveable: false }),
  onResumeGame: () => set({ ...get(), pause: false, moveable: true }),
}))

export const opponentPositionStream = new Subject<OpponentPositionType>()

export const opponentRotationStream = new Subject<OpponentRotationType>()
