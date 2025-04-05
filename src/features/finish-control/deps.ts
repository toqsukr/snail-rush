import { createStrictContext, useStrictContext } from '@shared/lib/react'

type FinishControlDeps = {
  onFinish: () => void
}

export const finishControlDepsContext = createStrictContext<FinishControlDeps>()

export const useFinishControl = () => useStrictContext(finishControlDepsContext)
