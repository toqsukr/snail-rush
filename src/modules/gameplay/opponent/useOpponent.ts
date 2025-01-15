import { PlayerStatus } from '@modules/lobby/type'
import { useEffect } from 'react'
import { Vector3 } from 'three'
import { sequentialOpponentPosition } from '../model/sequential-opponent-position'
import { sequentialOpponentRotation } from '../model/sequential-opponent-rotation'
import { useSnailJump } from '../model/useSnailJump'

export const useOpponent = (mode: PlayerStatus) => {
  const { model, triggerJump, triggerRotate, position, rotation } = useSnailJump(mode, 'joined')

  useEffect(() => {
    const subscriptionPosition = sequentialOpponentPosition.subscribe(({ position }) => {
      const { x, y, z, duration } = position
      triggerJump(new Vector3(x, y, z), duration)
    })

    const subscriptionRotation = sequentialOpponentRotation.subscribe(({ rotation }) => {
      const { pitch } = rotation
      triggerRotate(pitch)
    })

    return () => {
      subscriptionPosition.unsubscribe()
      subscriptionRotation.unsubscribe()
    }
  }, [])

  return { model, position, rotation }
}
