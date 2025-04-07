import { TUser } from '@entities/user'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PlayerStatus } from '../lib/status'

const GAME_STORE_KEY = 'game-data-store'

const START_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

type GameStore = {
  pause: boolean
  started: boolean
  moveable: boolean
  finished: boolean
  menuPosition: [number, number, number]
  winner: TUser | null
  pauseGame: () => void
  startGame: () => void
  finishGame: () => void
  resumeGame: () => void
  allowMoving: () => void
  resetMenuPosition: () => void
  playerStatus: PlayerStatus | null
  updateWinner: (winner: TUser) => void
  updateMoveable: (moveable: boolean) => void
  updatePlayerStatus: (playerStatus: PlayerStatus | null) => void
  updateMenuPosition: (menuPosition: [number, number, number]) => void
}

export const useGameStore = create(
  persist<GameStore, [], [], Pick<GameStore, 'playerStatus'>>(
    (set, get) => ({
      pause: false,
      winner: null,
      started: false,
      moveable: false,
      finished: false,
      playerStatus: null,
      menuPosition: START_MENU_POSITION,
      startGame: () => set({ ...get(), started: true }),
      updateWinner: winner => set({ ...get(), winner }),
      allowMoving: () => set({ ...get(), moveable: true }),
      updateMoveable: moveable => set({ ...get(), moveable }),
      pauseGame: () => set({ ...get(), pause: true, moveable: false }),
      resumeGame: () => set({ ...get(), pause: false, moveable: true }),
      updateMenuPosition: menuPosition => set({ ...get(), menuPosition }),
      updatePlayerStatus: playerStatus => set({ ...get(), playerStatus }),
      resetMenuPosition: () => set({ ...get(), menuPosition: START_MENU_POSITION }),
      finishGame: () => set({ ...get(), started: false, moveable: false, finished: true }),
    }),
    {
      name: GAME_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ playerStatus: state.playerStatus }),
    }
  )
)
