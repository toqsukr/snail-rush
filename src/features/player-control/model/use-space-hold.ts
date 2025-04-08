import { useRef } from 'react'
import { usePlayerDeps } from '../deps'

export const useSpaceHold = (maxDuration: number) => {
  const startTime = useRef<number>(-1)
  const { onStartShrink, onStopShrink, getMoveable } = usePlayerDeps()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && startTime.current === -1 && getMoveable()) {
      startTime.current = Date.now()
      onStartShrink?.()
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    let pressDuration = 0
    if (event.code === 'Space' && startTime.current !== -1 && getMoveable()) {
      const endTime = Date.now()
      pressDuration = Math.min(endTime - startTime.current, maxDuration)
      startTime.current = -1
      onStopShrink?.()
    }

    return pressDuration
  }

  return { handleKeyDown, handleKeyUp }
}
