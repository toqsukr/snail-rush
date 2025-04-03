import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { Observable } from 'rxjs'
import { useAppendPosition } from '../model/sequential-position'
import { useAppendRotation } from '../model/sequential-rotation'
import { PositionType, RotationType } from '../model/types'

type SnailOrientationProvider = {
  appendPosition: (position: PositionType) => void
  appendRotation: (rotation: RotationType) => void
  sequentialPosition: Observable<PositionType>
  sequentialRotation: Observable<RotationType>
}

export const SnailOrientationContext = createStrictContext<SnailOrientationProvider>()

export const useSnailOrientationContext = () => useStrictContext(SnailOrientationContext)

export const SnailOrientationProvider: FC<PropsWithChildren> = ({ children }) => {
  const positionThread = useAppendPosition()
  const rotationThread = useAppendRotation()

  const value = {
    ...positionThread,
    ...rotationThread,
  }

  return (
    <SnailOrientationContext.Provider value={value}>{children}</SnailOrientationContext.Provider>
  )
}
