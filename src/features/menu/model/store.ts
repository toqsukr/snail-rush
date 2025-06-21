import { create } from 'zustand'

export type MenuMode =
  | 'auth-username'
  | 'auth-password'
  | 'main-menu'
  | 'main-menu-skin'
  | 'main-menu-feedback'
  | 'join-lobby'
  | 'lobby'
  | 'game-pause'
  | 'game-over'

type MenuStore = {
  mode: MenuMode
  visibility: boolean
  toAuthPassword: () => void
  toAuthUsername: () => void
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
  toSkins: () => void
  toFeedback: () => void
  updateMenuMode: (mode: MenuMode) => void
}

export const useMenu = create<MenuStore>((set, get) => ({
  mode: 'auth-username',
  visibility: true,
  toAuthUsername: () => set({ ...get(), mode: 'auth-username' }),
  toAuthPassword: () => set({ ...get(), mode: 'auth-password' }),
  updateMenuMode: mode => set({ ...get(), mode }),
  completeAuth: () => set({ ...get(), mode: 'main-menu' }),
  connectLobby: () => set({ ...get(), mode: 'lobby' }),
  joinLobby: () => set({ ...get(), mode: 'join-lobby' }),
  toSkins: () => set({ ...get(), mode: 'main-menu-skin' }),
  toFeedback: () => set({ ...get(), mode: 'main-menu-feedback' }),
  disconnectLobby: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToMainMenu: () => set({ ...get(), mode: 'main-menu', visibility: true }),
  backToLobby: () => set({ ...get(), mode: 'lobby', visibility: true }),
  playGame: () => set({ ...get(), mode: 'game-pause', visibility: false }),
  pauseGame: () => set({ ...get(), mode: 'game-pause', visibility: true }),
  resumeGame: () => set({ ...get(), visibility: false }),
  finishGame: () => set({ ...get(), mode: 'game-over', visibility: true }),
}))
