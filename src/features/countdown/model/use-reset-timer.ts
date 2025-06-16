import { useCountdownStore } from './store'

export const useResetTimer = () => {
  const { resetTimer } = useCountdownStore()

  return resetTimer
}
