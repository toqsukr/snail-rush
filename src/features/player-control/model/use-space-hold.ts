import { useRef } from 'react'

export const useSpaceHold = (maxDuration: number) => {
  const startTime = useRef<number>(-1)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && startTime.current === -1) {
      startTime.current = Date.now()
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    let pressDuration = 0
    if (event.code === 'Space' && startTime.current !== -1) {
      const endTime = Date.now()
      pressDuration = Math.min(endTime - startTime.current, maxDuration)
      startTime.current = -1
    }

    return pressDuration
  }

  return { handleKeyDown, handleKeyUp }
}
