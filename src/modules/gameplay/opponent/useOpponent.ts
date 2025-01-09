import { PlayerStatus } from '@modules/lobby/type'
import { useEffect, useRef } from 'react'
import { Object3D } from 'three'
import { sequentialPositionStream } from '../model/sequential-position'
import { useSnailJump } from '../snail-jump/useSnailJump'
import { useAppState } from '../store'

export const useOpponent = (mode: PlayerStatus) => {
  const modelRef = useRef<Object3D>(null)
  const { started } = useAppState()
  const { model, triggerJump, triggerRotate, position, calcTargetPosition, rotation } =
    useSnailJump(mode, 'joined')

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        const position = calcTargetPosition(0.6)
        triggerRotate(0.3)
        triggerJump(0.6, position)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [started])

  useEffect(() => {
    const subscription = sequentialPositionStream.subscribe(point => {
      triggerJump(0.5, point.position)
    })

    return () => subscription.unsubscribe()
  }, [triggerJump])

  return { modelRef, model, position, rotation }
}
