import { webSocketContext } from '@modules/app/websocket-provider/WebSocketProvider'
import { PlayerStatus } from '@modules/lobby/type'
import { useContext, useEffect } from 'react'
import { Vector3 } from 'three'
import { SPACE_HOLD_TIME } from '../constant'
import { useSnailJump } from '../snail-jump/useSnailJump'
import { useAppState } from '../store'
import { useSpaceHold } from '../useSpaceHold'

export const usePlayer = (
  mode: PlayerStatus,
  playerID: string,
  onJump: (position: Vector3) => void
) => {
  const { started } = useAppState()
  const jumpOptions = useSnailJump(mode, 'host')
  const { handleKeyDown, handleKeyUp } = useSpaceHold(SPACE_HOLD_TIME)
  const webSocketActions = useContext(webSocketContext)

  const { triggerJump, calcTargetPosition, triggerRotate, isJumping } = jumpOptions

  const handleJump = (koef: number) => {
    if (!isJumping() && started) {
      const position = calcTargetPosition(koef)
      // const duration = getAnimationDuration(koef)
      triggerJump(koef, position)
      webSocketActions?.sendTargetPosition(playerID, position)
      onJump(position)
    }
  }

  const handleRotate = (koef: number) => {
    if (!isJumping()) {
      triggerRotate(koef)
    }
  }

  const spaceCallback = (e: KeyboardEvent) => {
    if (e.key == ' ' || e.code == 'Space') {
      const duration = handleKeyUp(e)
      handleJump(duration / SPACE_HOLD_TIME)
    }
  }

  const arrowCallback = (e: KeyboardEvent) => {
    if (e.code == 'ArrowRight') {
      handleRotate(-0.2)
    }
    if (e.code == 'ArrowLeft') {
      handleRotate(0.2)
    }
    handleKeyDown(e)
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowCallback)
    window.addEventListener('keyup', spaceCallback)

    return () => {
      window.removeEventListener('keydown', arrowCallback)
      window.removeEventListener('keyup', spaceCallback)
    }
  }, [handleJump])

  return jumpOptions
}
