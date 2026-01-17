import { FC, PropsWithChildren } from 'react'
import { CountdownProvider } from '@features/countdown'
import { getPlayerPosition, getStartPosition, useGameStore } from '@features/game'

const START_TIMER_VALUE = 3

const CountdownLayout: FC<PropsWithChildren> = ({ children }) => {
  const { allowMoving, playerStatus } = useGameStore()
  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  const countdownDeps = {
    onAlarm: allowMoving,
    startValue: START_TIMER_VALUE,
    playerPosition: playerStartPosition,
  }

  return <CountdownProvider {...countdownDeps}>{children}</CountdownProvider>
}

export default CountdownLayout
