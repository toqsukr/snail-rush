import { useRegisterTools } from '@shared/lib/devtools'
import { useSnailParams } from './params'

export const useSnailTools = () => {
  const {
    bounceMultiplier,
    impulseMultiplier,
    dynamicObstacleMultiplier,
    collisionCooldown,
    stunTimeout,
    bounceJitter,
    updateBounceMultiplier,
    updateImpulseMultiplier,
    updateDynamicObstacleMultiplier,
    updateCollisionCooldown,
    updateStunTimeout,
    updateBounceJitter,
  } = useSnailParams.getState()

  useRegisterTools([
    {
      type: 'range',
      name: 'BOUNCE_MULTIPLIER',
      value: [bounceMultiplier, 0, 30, 0.5],
      onChange: ([value]) => updateBounceMultiplier(value),
    },
    {
      type: 'range',
      name: 'IMPULSE_MULTIPLIER',
      value: [impulseMultiplier, 0, 50, 0.5],
      onChange: ([value]) => updateImpulseMultiplier(value),
    },
    {
      type: 'range',
      name: 'DYNAMIC_OBSTACLE_MULTIPLIER',
      value: [dynamicObstacleMultiplier, 0, 1, 0.05],
      onChange: ([value]) => updateDynamicObstacleMultiplier(value),
    },
    {
      type: 'range',
      name: 'COLLISION_COOLDOWN',
      value: [collisionCooldown, 0, 3000, 50],
      onChange: ([value]) => updateCollisionCooldown(value),
    },
    {
      type: 'range',
      name: 'BOUNCE_JITTER',
      value: [bounceJitter, 0, 1, 0.02],
      onChange: ([value]) => updateBounceJitter(value),
    },
    {
      type: 'range',
      name: 'STUN_TIMEOUT',
      value: [stunTimeout, 0, 5000, 100],
      onChange: ([value]) => updateStunTimeout(value),
    },
  ])
}
