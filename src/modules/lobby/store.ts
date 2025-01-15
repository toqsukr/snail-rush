import { create } from 'zustand'
import { LobbyStore } from './type'

export const useLobby = create<LobbyStore>((set, get) => ({
  status: null,
  isGameStarted: false,
  setGameStarted: isGameStarted => set({ ...get(), isGameStarted }),
  onCreateLobby: () => set({ ...get(), status: 'host' }),
  onJoinLobby: () => set({ ...get(), status: 'joined' }),
  onClickBack: () => set({ ...get(), status: null }),
}))
