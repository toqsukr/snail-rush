import { useEffect, useRef } from 'react'
import { usePlayerDeps } from '../deps'
import { MAX_SPACE_HOLD_TIME } from '@shared/config/game'
import { useSnailContext } from '@features/snail'

export const useSpaceHold = () => {
  const startTime = useRef<number>(-1)
  const { onStartShrink, onStopShrink } = usePlayerDeps()
  const { stopShrinkAnimation } = useSnailContext()

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

  const blurCallback = () => {
    stopShrinkAnimation?.(true)
    handleKeyUp()
  }

  useEffect(() => {
    window.addEventListener('blur', blurCallback)

    return () => {
      window.removeEventListener('blur', blurCallback)
    }
  }, [stopShrinkAnimation])

  return { handleKeyDown, handleKeyUp }
}
