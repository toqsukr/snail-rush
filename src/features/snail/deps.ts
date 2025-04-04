import { createStrictContext, useStrictContext } from '@shared/lib/react'

type SnailDeps = {
  username: string
  modelPath: string
  startPosition: [number, number, number]
  shouldHandleCollision: (objectUserData: unknown) => boolean
  onCollision?: () => void
}

export const snailDepsContext = createStrictContext<SnailDeps>()

export const useSnailDeps = () => useStrictContext(snailDepsContext)
