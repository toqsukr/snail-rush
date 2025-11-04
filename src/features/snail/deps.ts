import { Emitter } from '@shared/lib/emitter'
import { createStrictContext, useStrictContext } from '@shared/lib/react'
import {
  PositionWithCorrectType,
  PositionWithoutCorrectType,
  RotationType,
  ShrinkType,
} from './model/types'

type SnailDeps = {
  texturePath: string
  stunTimeout: number
  shrinkDuration: number
  shouldHandleCollision: (objectUserData: unknown) => boolean
  positionEmitter: Emitter<PositionWithCorrectType> | Emitter<PositionWithoutCorrectType>
  rotationEmitter: Emitter<RotationType>
  shrinkEmitter?: Emitter<ShrinkType>
  onCollision?: () => void
  startPosition?: [number, number, number]
  startRotation?: [number, number, number]
  handleModelHandle?: (modelHandle: number) => void
}

export const snailDepsContext = createStrictContext<SnailDeps>()

export const useSnailDeps = () => useStrictContext(snailDepsContext)
