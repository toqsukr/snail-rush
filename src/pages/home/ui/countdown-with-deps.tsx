import { Countdown } from '@features/countdown'
import { Suspense } from 'react'
import { COUNTDOWN_ROTATION } from '../../../app/constants'
import { useGameStore } from '../model/store'

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
