import { FC, PropsWithChildren } from 'react'
import { CountdownProvider } from '@features/countdown'
import { getPlayerPosition, getStartPosition, useGameStore } from '@features/game'
import { COUNTDOWN_DURATION } from '@shared/config/game'

const CountdownLayout: FC<PropsWithChildren> = ({ children }) => {
  const { allowMoving, playerStatus } = useGameStore()
  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  const countdownDeps = {
    onAlarm: allowMoving,
    duration: COUNTDOWN_DURATION,
    playerPosition: playerStartPosition,
  }

  return <CountdownProvider {...countdownDeps}>{children}</CountdownProvider>
}

export default CountdownLayout
