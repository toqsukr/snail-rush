import { create } from 'zustand'

type LogFlowStore = {
  logFlow: string[]
  setLogFlow: (logFlow: string[]) => void
}

export const useLogFlow = create<LogFlowStore>((set, get) => ({
  logFlow: [],
  setLogFlow: logFlow => set({ ...get(), logFlow }),
}))
