import { StorageKeys } from '@modules/app/type.d'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlayerData, PlayerDataStore } from './type.d'

export const usePlayerData = create(
  persist<PlayerDataStore, [], [], Partial<PlayerData>>(
    (set, get) => ({
      player_id: undefined,
      username: '',
      setPlayerData: playerData => set({ ...get(), ...playerData }),
      setUsername: username => set({ ...get(), username }),
    }),
    {
      name: StorageKeys.PLAYER_DATA,
      partialize: ({ player_id, username }) => ({
        player_id,
        username,
      }),
    }
  )
)
