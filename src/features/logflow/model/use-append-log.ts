import { useLogFlow } from './store'

export const useAppendLog = () => {
  const { logFlow, setLogFlow } = useLogFlow()

  const timeTag = new Date().toISOString()

  return (log: string) => {
    setLogFlow([...logFlow, `${timeTag.slice(11, 19)}: ${log}`])
  }
}
