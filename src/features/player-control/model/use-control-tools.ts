import { useRegisterTools } from '@shared/lib/devtools'
import { useControlParams } from './params'

export const useControlTools = () => {
  const {
    minIncrement,
    maxIncrement,
    step,
    maxSpaceHoldTime,
    updateMinIncrement,
    updateMaxIncrement,
    updateStep,
    updateMaxSpaceHoldTime,
  } = useControlParams.getState()

  useRegisterTools([
    {
      type: 'range',
      name: 'MIN_INCREMENT',
      value: [minIncrement, 0, 0.5, 0.005],
      onChange: ([value]) => updateMinIncrement(value),
    },
    {
      type: 'range',
      name: 'MAX_INCREMENT',
      value: [maxIncrement, 0, 2, 0.01],
      onChange: ([value]) => updateMaxIncrement(value),
    },
    {
      type: 'range',
      name: 'STEP',
      value: [step, 0.005, 0.2, 0.005],
      onChange: ([value]) => updateStep(value),
    },
    {
      type: 'range',
      name: 'MAX_SPACE_HOLD_TIME',
      value: [maxSpaceHoldTime, 100, 3000, 50],
      onChange: ([value]) => updateMaxSpaceHoldTime(value),
    },
  ])
}
