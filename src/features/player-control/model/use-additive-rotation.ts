import { useRef } from 'react'
import { useControlParams } from './params'

export const useAdditiveRotation = () => {
  const x = useRef(0)

  const incrementX = () => {
    x.current += useControlParams.getState().step
  }

  const decrementX = () => {
    x.current -= useControlParams.getState().step
  }

  const resetX = () => {
    x.current = 0
  }

  const calcRotationIncrement = () => {
    const { minIncrement, maxIncrement } = useControlParams.getState()
    const sign = Math.sign(x.current)
    const y = (maxIncrement / Math.PI) * Math.atan(x.current)

    if (sign > 0) {
      return Math.max(minIncrement, y)
    }

    return Math.min(sign * minIncrement, y)
  }

  return { incrementX, decrementX, resetX, calcRotationIncrement }
}
