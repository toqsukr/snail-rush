import { Subject } from 'rxjs'
import { create } from 'zustand'
import { AppState, OpponentPositionType, OpponentRotationType } from './type.d'

export const useAppState = create<AppState>((set, get) => ({
  started: false,
  moveable: false,
  allowMoving: () => set({ ...get(), moveable: true }),
  onWin: () => set({ ...get(), started: false, moveable: false }),
  onGameOver: () => set({ ...get(), started: false, moveable: false }),
  onGameStart: () => set({ ...get(), started: true }),
}))

export const opponentPositionStream = new Subject<OpponentPositionType>()

export const opponentRotationStream = new Subject<OpponentRotationType>()
