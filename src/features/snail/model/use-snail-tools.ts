import { useRegisterTools } from '@shared/lib/devtools'
import { useSnailParams } from './params'

export const useSnailTools = () => {
  const { bounceMultiplier, impulseMultiplier, updateBounceMultiplier, updateImpulseMultiplier } =
    useSnailParams.getState()

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
  ])
}
