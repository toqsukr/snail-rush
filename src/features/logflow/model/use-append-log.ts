import { useLogFlow } from './store'

export const useAppendLog = () => {
  const { logFlow, setLogFlow } = useLogFlow()

  const localTime = new Date().toISOString()

  return (log: string, time?: Date) => {
    const timeTag = time ? time.toISOString() : localTime
    setLogFlow([...logFlow, `${timeTag.slice(11, 19)}: ${log}`])
  }
}
