import { useRef } from 'react'
import { usePlayerDeps } from '../deps'
import { MAX_SPACE_HOLD_TIME } from '@shared/config/game'

export const useSpaceHold = () => {
  const startTime = useRef<number>(-1)
  const { onStartShrink, onStopShrink } = usePlayerDeps()

  const handleKeyDown = () => {
    if (startTime.current === -1) {
      startTime.current = Date.now()
      onStartShrink?.()
    }
  }

  const handleKeyUp = () => {
    let pressDuration = 0
    if (startTime.current !== -1) {
      const endTime = Date.now()
      pressDuration = Math.min(endTime - startTime.current, MAX_SPACE_HOLD_TIME)
      startTime.current = -1
      onStopShrink?.()
    }

    return pressDuration
  }

  return { handleKeyDown, handleKeyUp }
}
