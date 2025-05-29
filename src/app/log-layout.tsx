import { Logflow } from '@features/logflow'
import { FC, PropsWithChildren } from 'react'

const LogLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='h-full relative'>
      <Logflow />
      {children}
    </div>
  )
}

export default LogLayout
