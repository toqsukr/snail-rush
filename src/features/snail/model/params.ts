import { create } from 'zustand'
import { BOUNCE_MULTIPLIER, IMPULSE_MULTIPLIER } from './constants'

type SnailParams = {
  bounceMultiplier: number
  impulseMultiplier: number
  updateBounceMultiplier: (bounceMultiplier: number) => void
  updateImpulseMultiplier: (impulseMultiplier: number) => void
}

export const useSnailParams = create<SnailParams>((set, get) => ({
  bounceMultiplier: BOUNCE_MULTIPLIER,
  impulseMultiplier: IMPULSE_MULTIPLIER,
  updateBounceMultiplier: bounceMultiplier => set({ ...get(), bounceMultiplier }),
  updateImpulseMultiplier: impulseMultiplier => set({ ...get(), impulseMultiplier }),
}))
