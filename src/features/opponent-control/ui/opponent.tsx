import { FC, PropsWithChildren, useEffect } from 'react'
import { useOpponentDeps } from '../deps'
import { sequentialPosition } from '../model/sequential-position'
import { sequentialRotation } from '../model/sequential-rotation'

export const Opponent: FC<PropsWithChildren> = ({ children }) => {
  const { onJump, onRotate } = useOpponentDeps()

  useEffect(() => {
    const subscriptionPosition = sequentialPosition.subscribe(position => {
      onJump(position)
    })

    const subscriptionRotation = sequentialRotation.subscribe(rotation => {
      onRotate(rotation)
    })

    return () => {
      subscriptionPosition.unsubscribe()
      subscriptionRotation.unsubscribe()
    }
  }, [])

  return children
}
