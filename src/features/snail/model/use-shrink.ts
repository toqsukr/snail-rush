import { useRef } from 'react'

export const useShrink = (
  isAnimating: () => boolean,
  animateShrink: () => void,
  interruptShrink: () => void
) => {
  const holdRef = useRef(false)

  const startShrinkAnimation = () => {
    if (!isAnimating()) {
      animateShrink()
    }
  }

  const stopShrinkAnimation = () => {
    holdRef.current = false
    interruptShrink()
  }

  return { startShrinkAnimation, stopShrinkAnimation }
}
