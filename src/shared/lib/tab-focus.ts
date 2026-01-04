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

  const blurCallback = () => {
    updateTabFocus(false)
  }

  const focusCallback = () => {
    updateTabFocus(true)
  }

  useEffect(() => {
    window.addEventListener('blur', blurCallback)
    window.addEventListener('focus', focusCallback)

    return () => {
      window.removeEventListener('blur', blurCallback)
      window.removeEventListener('focus', focusCallback)
    }
  }, [updateTabFocus])
}
