import { PlayerStatus } from '@modules/lobby/type'
import { FC, useEffect, useRef } from 'react'
import { Object3D } from 'three'
import { HOST_START_POSITION, JOINED_START_POSITION } from '../constant'
import JumpAnimation from '../jump-animation/PositionAnimation'
import { useSnailJump } from '../snail-jump/useSnailJump'
import { useAppState } from '../store'

const Opponent: FC<{ status: PlayerStatus }> = ({ status }) => {
  const startPosition = status === 'host' ? JOINED_START_POSITION : HOST_START_POSITION
  const animationData = `animations/full-jump-static${status === 'host' ? '-opponent' : ''}.glb`

  const modelRef = useRef<Object3D>(null)
  const { started } = useAppState()
  const { model, triggerJump, position, rotation } = useSnailJump(animationData, startPosition)

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        triggerJump(0.6)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [started])

  return (
    <JumpAnimation
      ref={modelRef}
      position={position as any}
      rotation={rotation as any}
      object={model.scene}
    />
  )
}

export default Opponent
