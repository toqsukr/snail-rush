import { useRef } from 'react'
import { MAX_INCREMENT, MIN_INCREMENT, STEP } from './constants'

export const useAdditiveRotation = () => {
  const x = useRef(0)

  const incrementX = () => {
    x.current += STEP
  }

  const decrementX = () => {
    x.current -= STEP
  }

  const resetX = () => {
    x.current = 0
  }

  const calcRotationIncrement = () => {
    const sign = Math.sign(x.current)
    const y = (MAX_INCREMENT / Math.PI) * Math.atan(x.current)

    if (sign > 0) {
      return Math.max(MIN_INCREMENT, y)
    }

    return Math.min(sign * MIN_INCREMENT, y)
  }

  return { incrementX, decrementX, resetX, calcRotationIncrement }
}
