import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLogFlow } from '../model/store'

export const Logflow: FC = () => {
  const { t } = useTranslation()
  const logFlow = useLogFlow(s => s.logFlow)

  if (!logFlow.length) return

  return (
    <aside
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
      className='fixed top-0 right-0 pb-6 z-[10] w-[400px] max-h-[170px] rounded-bl-xl'>
      <h1 className='text-center text-2xl my-3'>{t('lobby_log_text')}</h1>
      <ul className='flex flex-col-reverse flex-nowrap gap-1 w-full h-[10vh] text-lg px-6 overflow-y-auto overflow-x-hidden'>
        {logFlow.map((log, index) => (
          <li key={index}>
            <p>{log}</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
