import { StorageKeys } from '@modules/app/type.d'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlayerData, PlayerDataStore } from './type.d'

export const usePlayerData = create(
  persist<PlayerDataStore, [], [], Partial<PlayerData>>(
    (set, get) => ({
      id: undefined,
      username: '',
      setPlayerData: playerData => set({ ...get(), ...playerData }),
      setUsername: username => set({ ...get(), username }),
    }),
    {
      name: StorageKeys.PLAYER_DATA,
      partialize: ({ id, username }) => ({
        id,
        username,
      }),
    }
  )
)
