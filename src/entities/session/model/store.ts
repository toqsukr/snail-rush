import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const SESSION_CODE_STORE_KEY = 'session-code-store'

type SessionCodeStore = {
  code: string | null
  updateSession: (session: string) => void
  deleteSession: () => void
}

export const useSessionCode = create(
  persist<SessionCodeStore, [], [], Pick<SessionCodeStore, 'code'>>(
    (set, get) => ({
      code: null,
      updateSession: code => set({ ...get(), code }),
      deleteSession: () => set({ ...get(), code: null }),
    }),
    {
      name: SESSION_CODE_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ code: state.code }),
    }
  )
)
