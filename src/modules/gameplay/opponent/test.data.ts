import { useEffect } from 'react'
import { useOppnentState } from '../store'
import { AnimationPositionData } from '../type.d'

export const testPositions: AnimationPositionData[] = [
  { start: [6, 0, 0], end: [6, 0, 4] },
  { start: [6, 0, 4], end: [6, 0, 8] },
  { start: [6, 0, 8], end: [6, 0, 12] },
  { start: [6, 0, 12], end: [6, 0, 16] },
  { start: [6, 0, 16], end: [6, 0, 20] },
  { start: [6, 0, 20], end: [6, 0, 24] },
  { start: [6, 0, 24], end: [6, 0, 28] },
  { start: [6, 0, 28], end: [6, 0, 32] },
]
export const useGetPosition = () => {
  const { addPosition } = useOppnentState()

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      addPosition(testPositions[index])
    }, 1500)

    return () => clearInterval(interval)
  }, [])
}
