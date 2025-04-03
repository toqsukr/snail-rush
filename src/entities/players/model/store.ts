import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { TPlayer } from './types'

const PLAYERS_STORE_KEY = 'lobby-players-store'

type PlayerStore = {
  players: TPlayer[]
  updatePlayers: (players: TPlayer[]) => void
  removePlayer: (playerID: string) => void
}

export const usePlayers = create(
  persist<PlayerStore, [], [], Pick<PlayerStore, 'players'>>(
    (set, get) => ({
      players: [],
      updatePlayers: players => set({ ...get(), players }),
      removePlayer: playerID =>
        set({ ...get(), players: get().players.filter(player => player.id !== playerID) }),
    }),
    {
      name: PLAYERS_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ players: state.players }),
    }
  )
)
