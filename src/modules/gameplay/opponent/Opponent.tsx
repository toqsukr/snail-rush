import { useEffect, useRef } from 'react'
import { Object3D } from 'three'
import JumpAnimation from '../jump-animation/PositionAnimation'
import { useSnailJump } from '../snail-jump/useSnailJump'
import { useAppState } from '../store'

const Opponent = () => {
  const modelRef = useRef<Object3D>(null)
  const { started } = useAppState()
  const { model, triggerJump, position } = useSnailJump(
    'animations/full-jump-static-opponent.glb',
    [6, 0, 0]
  )

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        triggerJump(1)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [started])

  return <JumpAnimation ref={modelRef} position={position as any} object={model.scene} />
}

export default Opponent
