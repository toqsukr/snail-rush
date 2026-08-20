import { create } from 'zustand'
import { STUN_TIMEOUT } from '@shared/config/game'
import {
  BOUNCE_JITTER,
  BOUNCE_MULTIPLIER,
  DYNAMIC_OBSTACLE_MULTIPLIER,
  IMPULSE_MULTIPLIER,
  COLLISION_COOLDOWN,
} from './constants'

type SnailParams = {
  bounceMultiplier: number
  impulseMultiplier: number
  dynamicObstacleMultiplier: number
  collisionCooldown: number
  stunTimeout: number
  bounceJitter: number
  updateBounceMultiplier: (bounceMultiplier: number) => void
  updateImpulseMultiplier: (impulseMultiplier: number) => void
  updateDynamicObstacleMultiplier: (dynamicObstacleMultiplier: number) => void
  updateCollisionCooldown: (collisionCooldown: number) => void
  updateStunTimeout: (stunTimeout: number) => void
  updateBounceJitter: (bounceJitter: number) => void
}

export const useSnailParams = create<SnailParams>((set, get) => ({
  bounceMultiplier: BOUNCE_MULTIPLIER,
  impulseMultiplier: IMPULSE_MULTIPLIER,
  dynamicObstacleMultiplier: DYNAMIC_OBSTACLE_MULTIPLIER,
  collisionCooldown: COLLISION_COOLDOWN,
  stunTimeout: STUN_TIMEOUT,
  bounceJitter: BOUNCE_JITTER,
  updateBounceMultiplier: bounceMultiplier => set({ ...get(), bounceMultiplier }),
  updateImpulseMultiplier: impulseMultiplier => set({ ...get(), impulseMultiplier }),
  updateDynamicObstacleMultiplier: dynamicObstacleMultiplier =>
    set({ ...get(), dynamicObstacleMultiplier }),
  updateCollisionCooldown: collisionCooldown => set({ ...get(), collisionCooldown }),
  updateStunTimeout: stunTimeout => set({ ...get(), stunTimeout }),
  updateBounceJitter: bounceJitter => set({ ...get(), bounceJitter }),
}))
