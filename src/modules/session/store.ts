import { StorageKeys } from '@modules/app/type.d'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { SessionStore } from './type.d'

export const useSession = create(
  persist<SessionStore, [], [], Pick<SessionStore, 'session'>>(
    (set, get) => ({
      session: null,
      setSession: session => set({ ...get(), session }),
      onChangePlayers: players => {
        const session = get().session
        if (session) {
          set({ ...get(), session: { ...session, players: players } })
        }
      },
    }),
    {
      name: StorageKeys.SESSION_DATA,
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ session }) => ({ session }),
    }
  )
)
