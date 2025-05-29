import { useLogFlow } from './store'

export const useClearLogs = () => {
  const { setLogFlow } = useLogFlow()

  return () => setLogFlow([])
}
