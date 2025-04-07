import { FC, ReactNode } from 'react'
import { useStartTimer } from '../model/use-start-timer'

export const CountdownRenderLayout: FC<{
  renderChildren: (startTimer: () => void, resetTimer: () => void) => ReactNode
}> = ({ renderChildren }) => {
  const { startTimer, resetTimer } = useStartTimer()

  return renderChildren(startTimer, resetTimer)
}
