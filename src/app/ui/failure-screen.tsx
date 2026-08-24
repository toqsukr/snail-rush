import { FC, ReactNode } from 'react'

export type FailureScreenProps = {
  title: string
  hint: string
  action?: ReactNode
}

const FailureScreen: FC<FailureScreenProps> = ({ title, hint, action }) => (
  <div className='h-full w-full flex flex-col items-center justify-center gap-4 px-8 text-center'>
    <h1 className='text-3xl text-white'>{title}</h1>
    <p className='text-lg text-white/70 max-w-md'>{hint}</p>
    {action}
  </div>
)

export default FailureScreen
