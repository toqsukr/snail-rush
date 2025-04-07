import { Countdown } from '@features/countdown'
import { Suspense } from 'react'
import { useGameStore } from '../model/store'

const CountdownWithDeps = () => {
  const { playerStatus } = useGameStore()

  if (!playerStatus) return

  return (
    <Suspense fallback={null}>
      <Countdown rotation={[Math.PI / 8, 0, 0]} />
    </Suspense>
  )
}

export default CountdownWithDeps
