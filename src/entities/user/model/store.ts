import { create } from 'zustand'
import { TUser } from './types'

type UserStore = {
  user: TUser | null
  updateUser: (user: TUser) => void
  deleteUser: () => void
}

export const useUser = create<UserStore>((set, get) => ({
  user: null,
  updateUser: user => set({ ...get(), user }),
  deleteUser: () => set({ ...get(), user: null }),
}))
