import { PlayerStatus } from '@modules/lobby/type'
import { useEffect, useRef } from 'react'
import { Object3D } from 'three'
import { sequentialOpponentStream } from '../model/sequential-opponent-stream'
import { useSnailJump } from '../model/useSnailJump'
import { useGetPosition } from './test.data'

export const useOpponent = (mode: PlayerStatus) => {
  const modelRef = useRef<Object3D>(null)
  const { model, triggerJump, position, rotation } = useSnailJump(mode, 'joined')

  useGetPosition()

  useEffect(() => {
    const subscription = sequentialOpponentStream.subscribe(({ position, duration }) => {
      triggerJump(position, duration)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { modelRef, model, position, rotation }
}
