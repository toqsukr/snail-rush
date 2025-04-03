import { useCountdownStore } from './store'

export const useStartTimer = () => {
  const { updateRunning } = useCountdownStore()

  return () => {
    updateRunning(true)
  }
}
