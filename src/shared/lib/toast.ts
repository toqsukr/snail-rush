import { create } from 'zustand'

export type Toast = {
  id: number
  text: string
}

type ToastStore = {
  toasts: Toast[]
  push: (text: string) => void
  dismiss: (id: number) => void
}

export const TOAST_TIMEOUT = 5000

let lastID = 0

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: text =>
    set({
      toasts: get().toasts.some(toast => toast.text === text)
        ? get().toasts
        : [...get().toasts, { id: ++lastID, text }],
    }),
  dismiss: id => set({ toasts: get().toasts.filter(toast => toast.id !== id) }),
}))

export const useToasts = () => useToastStore(state => state.toasts)

export const pushToast = (text: string) => useToastStore.getState().push(text)

export const dismissToast = (id: number) => useToastStore.getState().dismiss(id)
