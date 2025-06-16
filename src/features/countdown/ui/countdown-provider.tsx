import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'

type CountdownDeps = {
  startValue: number
  playerPosition: [number, number, number]
  onAlarm: () => void
}

const countdownDepsContext = createStrictContext<CountdownDeps>()

export const useCountdownDeps = () => useStrictContext(countdownDepsContext)

export const CountdownProvider: FC<PropsWithChildren<CountdownDeps>> = ({ children, ...deps }) => {
  return <countdownDepsContext.Provider value={deps}>{children}</countdownDepsContext.Provider>
}
