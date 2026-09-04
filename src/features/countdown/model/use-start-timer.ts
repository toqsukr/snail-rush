import { useCountdownStore } from './store'

export const useStartTimer = () => {
  const { startTimer } = useCountdownStore()

  return startTimer
}
