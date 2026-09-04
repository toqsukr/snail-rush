import { create } from 'zustand'
import { STUN_TIMEOUT } from '@shared/config/game'
import {
  BOUNCE_JITTER,
  BOUNCE_MULTIPLIER,
  DYNAMIC_OBSTACLE_MULTIPLIER,
  IMPULSE_MULTIPLIER,
  LINEAR_DAMPING,
  COLLISION_COOLDOWN,
  MIN_APPROACH_SPEED,
} from './constants'

type SnailParams = {
  bounceMultiplier: number
  impulseMultiplier: number
  dynamicObstacleMultiplier: number
  collisionCooldown: number
  minApproachSpeed: number
  stunTimeout: number
  bounceJitter: number
  linearDamping: number
  updateBounceMultiplier: (bounceMultiplier: number) => void
  updateImpulseMultiplier: (impulseMultiplier: number) => void
  updateDynamicObstacleMultiplier: (dynamicObstacleMultiplier: number) => void
  updateCollisionCooldown: (collisionCooldown: number) => void
  updateMinApproachSpeed: (minApproachSpeed: number) => void
  updateStunTimeout: (stunTimeout: number) => void
  updateBounceJitter: (bounceJitter: number) => void
  updateLinearDamping: (linearDamping: number) => void
}

export const useSnailParams = create<SnailParams>((set, get) => ({
  bounceMultiplier: BOUNCE_MULTIPLIER,
  impulseMultiplier: IMPULSE_MULTIPLIER,
  dynamicObstacleMultiplier: DYNAMIC_OBSTACLE_MULTIPLIER,
  collisionCooldown: COLLISION_COOLDOWN,
  minApproachSpeed: MIN_APPROACH_SPEED,
  stunTimeout: STUN_TIMEOUT,
  bounceJitter: BOUNCE_JITTER,
  linearDamping: LINEAR_DAMPING,
  updateBounceMultiplier: bounceMultiplier => set({ ...get(), bounceMultiplier }),
  updateImpulseMultiplier: impulseMultiplier => set({ ...get(), impulseMultiplier }),
  updateDynamicObstacleMultiplier: dynamicObstacleMultiplier =>
    set({ ...get(), dynamicObstacleMultiplier }),
  updateCollisionCooldown: collisionCooldown => set({ ...get(), collisionCooldown }),
  updateMinApproachSpeed: minApproachSpeed => set({ ...get(), minApproachSpeed }),
  updateStunTimeout: stunTimeout => set({ ...get(), stunTimeout }),
  updateBounceJitter: bounceJitter => set({ ...get(), bounceJitter }),
  updateLinearDamping: linearDamping => set({ ...get(), linearDamping }),
}))
