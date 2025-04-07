import { useCountdownStore } from './store'

export const useStartTimer = () => {
  const { updateStarted, resetTimer } = useCountdownStore()

  const startTimer = () => {
    updateStarted(true)
  }

  return { startTimer, resetTimer }
}
