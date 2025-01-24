import { getPlayerPosition, getStartPosition } from '@modules/gameplay/util'
import StartTimer from '@objects/start-timer/StartTimer'
import { Suspense } from 'react'
import { useStartTimer } from './useStartTimer'

const StartTimerScene = () => {
  const { status, countdown } = useStartTimer()

  if (!status || !countdown) return

  const playerPosition = getStartPosition(getPlayerPosition(status))

  const position = [playerPosition[0], playerPosition[1] + 8, playerPosition[2]]

  return (
    <Suspense fallback={null}>
      <StartTimer position={position} rotation={[-Math.PI / 8, Math.PI, 0]} />
    </Suspense>
  )
}

export default StartTimerScene
