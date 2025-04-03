import { TUser } from '@entities/user'
import { create } from 'zustand'

type GameStore = {
  started: boolean
  moveable: boolean
  pause: boolean
  finished: boolean
  winner: TUser | null
  updateWinner: (winner: TUser) => void
  updateMoveable: (moveable: boolean) => void
  pauseGame: () => void
  resumeGame: () => void
  startGame: () => void
  allowMoving: () => void
  finishGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  started: false,
  moveable: false,
  finished: false,
  pause: false,
  winner: null,
  updateWinner: winner => set({ ...get(), winner }),
  updateMoveable: moveable => set({ ...get(), moveable }),
  allowMoving: () => set({ ...get(), moveable: true }),
  finishGame: () => set({ ...get(), started: false, moveable: false, finished: true }),
  startGame: () => set({ ...get(), started: true }),
  pauseGame: () => set({ ...get(), pause: true, moveable: false }),
  resumeGame: () => set({ ...get(), pause: false, moveable: true }),
}))
