import { FC } from 'react'
import { useLogFlow } from '../model/store'

export const Logflow: FC = () => {
  const logFlow = useLogFlow(s => s.logFlow)

  if (!logFlow.length) return

  return (
    <aside
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
      className='fixed top-0 right-0 pb-6 z-[10] max-w-[400px] max-h-[225px] rounded-bl-xl '>
      <h1 className='text-center text-2xl my-3'>LOBBY LOG</h1>
      <ul className='flex flex-col-reverse gap-1 w-[40vw] h-[10vh] text-lg px-6 overflow-auto'>
        {logFlow.map((log, index) => (
          <li key={index}>
            <p>{log}</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
