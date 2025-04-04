import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { TSession } from './types'

const SESSION_STORE_KEY = 'session-data-store'

type SessionStore = {
  session: TSession | null
  updateSession: (session: TSession) => void
  deleteSession: () => void
}

export const useSession = create(
  persist<SessionStore, [], [], Pick<SessionStore, 'session'>>(
    (set, get) => ({
      session: null,
      updateSession: session => set({ ...get(), session }),
      deleteSession: () => set({ ...get(), session: null }),
    }),
    {
      name: SESSION_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ session: state.session }),
    }
  )
)
