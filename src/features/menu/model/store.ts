import { create } from 'zustand'

export type MenuMode = 'auth' | 'main-menu' | 'join-lobby' | 'lobby' | 'game-pause' | 'game-over'

type MenuStore = {
  mode: MenuMode
  visibility: boolean
  completeAuth: () => void
  joinLobby: () => void
  connectLobby: () => void
  disconnectLobby: () => void
  backToMainMenu: () => void
  backToLobby: () => void
  playGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  finishGame: () => void
  updateMenuMode: (mode: MenuMode) => void
}

export const useMenu = create<MenuStore>((set, get) => ({
  mode: 'main-menu',
  visibility: true,
  updateMenuMode: mode => set({ ...get(), mode }),
  completeAuth: () => set({ ...get(), mode: 'main-menu' }),
  connectLobby: () => set({ ...get(), mode: 'lobby' }),
  joinLobby: () => set({ ...get(), mode: 'join-lobby' }),
  disconnectLobby: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToMainMenu: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToLobby: () => set({ ...get(), mode: 'lobby', visibility: true }),
  playGame: () => set({ ...get(), mode: 'game-pause', visibility: false }),
  pauseGame: () => set({ ...get(), mode: 'game-pause', visibility: true }),
  resumeGame: () => set({ ...get(), visibility: false }),
  finishGame: () => set({ ...get(), mode: 'game-over', visibility: true }),
}))
