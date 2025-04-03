import { useState } from 'react'

export const useSpaceHold = (maxDuration: number) => {
  const [startTime, setStartTime] = useState<number | null>(null)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && startTime === null) {
      setStartTime(Date.now())
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    let pressDuration = 0
    if (event.code === 'Space' && startTime !== null) {
      const endTime = Date.now()
      pressDuration = Math.min(endTime - startTime, maxDuration)
      setStartTime(null)
    }

    return pressDuration
  }

  return { handleKeyDown, handleKeyUp }
}
