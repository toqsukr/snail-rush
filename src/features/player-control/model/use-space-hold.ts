import { useEffect, useRef } from 'react'
import { usePlayerDeps } from '../deps'
import { useSnailContext } from '@features/snail'
import { useControlParams } from './params'

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
      const limit = useControlParams.getState().maxSpaceHoldTime
      pressDuration = Math.min(endTime - startTime.current, limit)
      startTime.current = -1
      onStopShrink?.()
    }

    return pressDuration
  }

  const resetHold = () => {
    handleKeyUp()
  }

  const blurCallback = () => {
    stopShrinkAnimation?.(true)
    resetHold()
  }

  useEffect(() => {
    window.addEventListener('blur', blurCallback)

    return () => {
      window.removeEventListener('blur', blurCallback)
    }
  }, [stopShrinkAnimation])

  return { handleKeyDown, handleKeyUp, resetHold }
}
