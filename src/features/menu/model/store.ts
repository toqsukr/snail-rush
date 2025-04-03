import { create } from 'zustand'

export type MenuMode = 'main-menu' | 'lobby' | 'game-pause' | 'game-over'

type MenuStore = {
  mode: MenuMode
  visibility: boolean
  connectLobby: () => void
  disconnectLobby: () => void
  backToMainMenu: () => void
  backToLobby: () => void
  playGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  finishGame: () => void
}

export const useMenu = create<MenuStore>((set, get) => ({
  mode: 'main-menu',
  visibility: true,
  connectLobby: () => set({ ...get(), mode: 'lobby' }),
  disconnectLobby: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToMainMenu: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToLobby: () => set({ ...get(), mode: 'lobby', visibility: true }),
  playGame: () => set({ ...get(), mode: 'game-pause', visibility: false }),
  pauseGame: () => set({ ...get(), mode: 'game-pause', visibility: true }),
  resumeGame: () => set({ ...get(), visibility: false }),
  finishGame: () => set({ ...get(), mode: 'game-over', visibility: true }),
}))
