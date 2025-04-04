import { useCountdownStore } from './store'

export const useStartTimer = () => {
  const { updateStarted } = useCountdownStore()

  return () => {
    updateStarted(true)
  }
}
