import { FC, ReactNode } from 'react'
import { useStartTimer } from '../model/use-start-timer'

export const CountdownRenderLayout: FC<{
  renderChildren: (startTimer: () => void) => ReactNode
}> = ({ renderChildren }) => {
  const startTimer = useStartTimer()

  return renderChildren(startTimer)
}
