import { TPlayer } from '@entities/players'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PlayerStatus } from '../lib/status'

const GAME_STORE_KEY = 'game-data-store'

type GameStore = {
  pause: boolean
  started: boolean
  moveable: boolean
  finished: boolean
  winner: TPlayer | null
  pauseGame: () => void
  startGame: () => void
  finishGame: () => void
  toMainMenu: () => void
  resumeGame: () => void
  allowMoving: () => void
  playerStatus: PlayerStatus | null
  updateWinner: (winner: TPlayer) => void
  updateMoveable: (moveable: boolean) => void
  updatePlayerStatus: (playerStatus: PlayerStatus | null) => void
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
      startGame: () => set({ ...get(), started: true, finished: false, winner: null }),
      updateWinner: winner => set({ ...get(), winner }),
      allowMoving: () => set({ ...get(), moveable: true }),
      updateMoveable: moveable => set({ ...get(), moveable }),
      pauseGame: () => set({ ...get(), pause: true, moveable: false }),
      resumeGame: () => set({ ...get(), pause: false, moveable: true }),
      updatePlayerStatus: playerStatus => set({ ...get(), playerStatus }),
      finishGame: () => set({ ...get(), moveable: false, finished: true, pause: false }),
      toMainMenu: () =>
        set({ ...get(), started: false, moveable: false, finished: true, pause: false }),
    }),
    {
      name: GAME_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ playerStatus: state.playerStatus }),
    }
  )
)
