import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren, useMemo } from 'react'
import { Observable } from 'rxjs'
import { Vector3 } from 'three'
import { useAppendPosition } from '../model/sequential-position'
import { useAppendRotation } from '../model/sequential-rotation'
import { createSnailStore, SnailStore } from '../model/store'
import { PositionType, RotationType } from '../model/types'
import { useCalcAnimationDuration, useCalcTargetPosition } from '../model/use-jump'

type SnailProvider = {
  sequentialPosition: Observable<PositionType>
  sequentialRotation: Observable<RotationType>
  appendPosition: (position: PositionType) => void
  appendRotation: (rotation: RotationType) => void
  calcTargetPosition: (koef: number) => Vector3
  calcAnimationDuration: (koef: number) => number
} & SnailStore

export const SnailContext = createStrictContext<SnailProvider>()

export const useSnailContext = () => useStrictContext(SnailContext)

export const SnailProvider: FC<PropsWithChildren> = ({ children }) => {
  const useSnailStore = useMemo(() => createSnailStore(), [])
  const storeData = useSnailStore()

  const positionThread = useMemo(useAppendPosition, [])
  const rotationThread = useMemo(useAppendRotation, [])
  const calcTargetPosition = useCalcTargetPosition(storeData.position, storeData.rotation)
  const calcAnimationDuration = useCalcAnimationDuration()

  const value = {
    calcTargetPosition,
    calcAnimationDuration: (koef: number) => calcAnimationDuration(0, koef),
    ...positionThread,
    ...rotationThread,
    ...storeData,
  }

  return <SnailContext.Provider value={value}>{children}</SnailContext.Provider>
}
