import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from './store'

/**
 * Movement lock for the stun window. Freezes the moveable flag for the given
 * duration, ignores repeated locks while one is pending, never unfreezes a
 * paused or finished game and dies together with its component.
 */
export const useStunLock = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  return useCallback((duration: number) => {
    if (timer.current) return
    useGameStore.getState().updateMoveable(false)
    timer.current = setTimeout(() => {
      timer.current = null
      const { pause, finished, updateMoveable } = useGameStore.getState()
      if (!pause && !finished) updateMoveable(true)
    }, duration)
  }, [])
}
