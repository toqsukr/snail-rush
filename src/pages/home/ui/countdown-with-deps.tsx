import { Countdown, countdownDepsContext } from '@features/countdown'
import { PLAYER_START_POSITION } from '../'
import { useGameStore } from '../model/store'

const START_TIMER_VALUE = 3

const CountdownWithDeps = () => {
  const allowMoving = useGameStore(s => s.allowMoving)

  return (
    <countdownDepsContext.Provider
      value={{
        onAlarm: allowMoving,
        startValue: START_TIMER_VALUE,
        playerPosition: PLAYER_START_POSITION,
      }}>
      <Countdown rotation={[-Math.PI / 8, Math.PI, 0]} />
    </countdownDepsContext.Provider>
  )
}

export default CountdownWithDeps
