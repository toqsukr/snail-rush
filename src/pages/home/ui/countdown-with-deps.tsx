import { Countdown } from '@features/countdown'
import { Suspense } from 'react'
import { useGameStore } from '../model/store'

const COUNTDOWN_ROTATION = [Math.PI / 8, 0, 0]

const CountdownWithDeps = () => {
  const { playerStatus } = useGameStore()

  if (!playerStatus) return

  return (
    <Suspense fallback={null}>
      <Countdown rotation={COUNTDOWN_ROTATION} />
    </Suspense>
  )
}

export default CountdownWithDeps
