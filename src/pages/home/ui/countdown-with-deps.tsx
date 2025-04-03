import { Countdown, countdownDepsContext } from '@features/countdown'
import { Suspense } from 'react'
import { getPlayerPosition, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const START_TIMER_VALUE = 3

const CountdownWithDeps = () => {
  const { playerStatus, allowMoving } = useGameStore()

  if (!playerStatus) return

  return (
    <Suspense fallback={null}>
      <countdownDepsContext.Provider
        value={{
          onAlarm: allowMoving,
          startValue: START_TIMER_VALUE,
          playerPosition: getStartPosition(getPlayerPosition(playerStatus)),
        }}>
        <Countdown rotation={[-Math.PI / 8, Math.PI, 0]} />
      </countdownDepsContext.Provider>
    </Suspense>
  )
}

export default CountdownWithDeps
