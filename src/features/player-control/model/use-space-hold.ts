import { useRef } from 'react'
import { usePlayerDeps } from '../deps'

export const useSpaceHold = () => {
  const startTime = useRef<number>(-1)
  const { onStartShrink, onStopShrink, getMoveable, getIsJumping, maxSpaceHold } = usePlayerDeps()

  const handleKeyDown = () => {
    if (startTime.current === -1 && getMoveable() && !getIsJumping()) {
      startTime.current = Date.now()
      onStartShrink?.()
    }
  }

  const handleKeyUp = () => {
    let pressDuration = 0
    if (startTime.current !== -1 && getMoveable() && !getIsJumping()) {
      const endTime = Date.now()
      pressDuration = Math.min(endTime - startTime.current, maxSpaceHold)
      startTime.current = -1
      onStopShrink?.()
    }

    return pressDuration
  }

  return { handleKeyDown, handleKeyUp }
}
