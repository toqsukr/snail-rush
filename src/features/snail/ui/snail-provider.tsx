import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { appendPosition } from '../model/sequential-position'
import { appendRotation } from '../model/sequential-rotation'
import { PositionType, RotationType } from '../model/types'

type SnailOrientationProvider = {
  appendPosition: (position: PositionType) => void
  appendRotation: (rotation: RotationType) => void
}

export const SnailOrientationContext = createStrictContext<SnailOrientationProvider>()

export const useSnailOrientationContext = () => useStrictContext(SnailOrientationContext)

export const SnailOrientationProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = {
    appendPosition,
    appendRotation,
  }
  return (
    <SnailOrientationContext.Provider value={value}>{children}</SnailOrientationContext.Provider>
  )
}
