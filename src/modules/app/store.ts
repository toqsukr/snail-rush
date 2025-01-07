import { create } from 'zustand'
import { APIStore } from './type.d'

export const useAPIStore = create<APIStore>((set, get) => ({
  socket: null,
  setSocket: socket => set({ ...get(), socket }),
}))
