import { createStrictContext, useStrictContext } from '@shared/lib/react'

type SnailDeps = {
  username: string
  modelPath: string
  shouldHandleCollision: (objectUserData: unknown) => boolean
  onCollision?: () => void
  startPosition?: [number, number, number]
  startRotation?: [number, number, number]
}

export const snailDepsContext = createStrictContext<SnailDeps>()

export const useSnailDeps = () => useStrictContext(snailDepsContext)
