import { useRef } from 'react'
import { useSnailContext } from '../ui/snail-provider'

export const useShrink = (animateShrink: () => void, interruptShrink: () => void) => {
  const holdRef = useRef(false)
  const { getIsJumping } = useSnailContext()

  const startShrinkAnimation = () => {
    if (!getIsJumping()) {
      animateShrink()
    }
  }

  const stopShrinkAnimation = () => {
    holdRef.current = false
    interruptShrink()
  }

  return { startShrinkAnimation, stopShrinkAnimation }
}
