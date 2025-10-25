import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'

type CountdownDeps = {
  startValue: number
  playerPosition: Vector3
  onAlarm: () => void
}

const countdownDepsContext = createStrictContext<CountdownDeps>()

export const useCountdownDeps = () => useStrictContext(countdownDepsContext)

export const CountdownProvider: FC<PropsWithChildren<CountdownDeps>> = ({ children, ...deps }) => {
  return <countdownDepsContext.Provider value={deps}>{children}</countdownDepsContext.Provider>
}
