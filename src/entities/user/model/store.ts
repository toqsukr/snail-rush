import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TUser } from './types'

const USER_STORE_KEY = 'user-data-store'

type UserStore = {
  user: TUser | null
  updateUser: (user: TUser) => void
  deleteUser: () => void
}

export const useUser = create(
  persist<UserStore, [], [], UserStore['user']>(
    (set, get) => ({
      user: null,
      updateUser: user => set({ ...get(), user }),
      deleteUser: () => set({ ...get(), user: null }),
    }),
    {
      name: USER_STORE_KEY,
      partialize: ({ user }) => user,
    }
  )
)
