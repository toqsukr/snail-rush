import { createStrictContext, useStrictContext } from '@shared/lib/react'

type CountdownDeps = {
  startValue: number
  playerPosition: [number, number, number]
  onAlarm: () => void
}

export const countdownDepsContext = createStrictContext<CountdownDeps>()

export const useCountdownDeps = () => useStrictContext(countdownDepsContext)
