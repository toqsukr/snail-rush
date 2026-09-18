import { useEffect } from 'react'
import { create } from 'zustand'

type TabFocusStore = {
  isTabFocus: boolean
  updateTabFocus: (isTabFocus: boolean) => void
}

const useTabFocusStore = create<TabFocusStore>((set, get) => ({
  isTabFocus: true,
  updateTabFocus: isTabFocus => set({ ...get(), isTabFocus }),
}))

export const useTabFocus = () => {
  const isTabFocus = useTabFocusStore(s => s.isTabFocus)

  return isTabFocus
}

export const useObserveTabFocus = () => {
  const updateTabFocus = useTabFocusStore(s => s.updateTabFocus)

  useEffect(() => {
    const leave = () => updateTabFocus(false)
    const enter = () => updateTabFocus(true)
    const toggle = () => updateTabFocus(document.visibilityState === 'visible')
    window.addEventListener('blur', leave)
    window.addEventListener('focus', enter)
    window.addEventListener('pagehide', leave)
    document.addEventListener('visibilitychange', toggle)

    return () => {
      window.removeEventListener('blur', leave)
      window.removeEventListener('focus', enter)
      window.removeEventListener('pagehide', leave)
      document.removeEventListener('visibilitychange', toggle)
    }
  }, [updateTabFocus])
}
