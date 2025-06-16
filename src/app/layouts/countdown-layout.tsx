import { START_TIMER_VALUE } from '@app/constants'
import { CountdownProvider } from '@features/countdown'
import { getPlayerPosition, getStartPosition } from '@pages/home/lib/status'
import { useGameStore } from '@pages/home/model/store'
import { FC, PropsWithChildren } from 'react'

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
