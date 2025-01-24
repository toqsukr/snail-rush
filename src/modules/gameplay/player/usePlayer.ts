import { webSocketContext } from '@modules/app/websocket-provider/WebSocketProvider'
import { PlayerStatus } from '@modules/lobby/type'
import { useContext, useEffect } from 'react'
import { Vector3 } from 'three'
import { SPACE_HOLD_TIME } from '../constant'
import { useSnailJump } from '../model/useSnailJump'
import { useSpaceHold } from '../model/useSpaceHold'
import { useAppState } from '../store'
import { getPlayerPosition, getPlayerSkin } from '../util'

export const usePlayer = (
  mode: PlayerStatus,
  playerID: string,
  onJump: (position: Vector3) => void
) => {
  const { moveable } = useAppState()

  const jumpOptions = useSnailJump(getPlayerPosition(mode), getPlayerSkin(mode))
  const { handleKeyDown, handleKeyUp } = useSpaceHold(SPACE_HOLD_TIME)
  const webSocketActions = useContext(webSocketContext)

  const {
    getRotation,
    triggerJump,
    calcTargetPosition,
    triggerRotate,
    isJumping,
    getAnimationDuration,
  } = jumpOptions

  const handleJump = (holdTime: number) => {
    const koef = holdTime / SPACE_HOLD_TIME
    if (!isJumping() && moveable) {
      const position = calcTargetPosition(koef)
      const duration = getAnimationDuration(koef)
      triggerJump(position, duration)
      const targetPosition = { position: { ...position, duration, hold_time: holdTime } }
      webSocketActions?.sendTargetPosition(playerID, targetPosition)
      onJump(position)
    }
  }

  const handleRotate = (directionKoef: number) => {
    const koef = 0.2 * directionKoef
    if (!isJumping() && moveable) {
      const rotationArr = getRotation()
      const updatedPitch = rotationArr[1] + koef
      const rotation = { roll: rotationArr[0], pitch: updatedPitch, yaw: rotationArr[2] }
      triggerRotate(updatedPitch)
      const targetRotation = { rotation: { ...rotation, duration: 0 } }
      webSocketActions?.sendTargetRotation(playerID, targetRotation)
    }
  }

  const spaceCallback = (e: KeyboardEvent) => {
    if (e.key == ' ' || e.code == 'Space') {
      const duration = handleKeyUp(e)
      handleJump(duration)
    }
  }

  const arrowCallback = (e: KeyboardEvent) => {
    if (e.code == 'ArrowRight') {
      handleRotate(-1)
    }
    if (e.code == 'ArrowLeft') {
      handleRotate(1)
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
