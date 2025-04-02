import { create } from 'zustand'
import { TSession } from './types'

type SessionStore = {
  session: TSession | null
  updateSession: (session: TSession) => void
  deleteSession: () => void
}

export const useSession = create<SessionStore>((set, get) => ({
  session: null,
  updateSession: session => set({ ...get(), session }),
  deleteSession: () => set({ ...get(), session: null }),
}))
