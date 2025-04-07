import { createStrictContext, useStrictContext } from '@shared/lib/react'

type FinishControlDeps = {
  onFinish: (userData: unknown) => void
}

export const finishControlDepsContext = createStrictContext<FinishControlDeps>()

export const useFinishControl = () => useStrictContext(finishControlDepsContext)
