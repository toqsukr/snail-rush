import { useLogFlow } from './store'

export const useAppendLog = () => {
  const { logFlow, setLogFlow } = useLogFlow()

  const localTime = new Date().toLocaleString('sv-SE')

  return (log: string, time?: Date) => {
    const timeTag = time ? time.toLocaleString('sv-SE') : localTime
    setLogFlow([...logFlow, `${timeTag.slice(11, 16)}: ${log}`])
  }
}
