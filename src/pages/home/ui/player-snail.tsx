import { useLobbyEventsContext } from '@features/lobby-events'
import { playerDepsContext } from '@features/player-control'
import {
  Snail,
  useCalcAnimationDuration,
  useCalcTargetPosition,
  useGetRotation,
  useSnailOrientationContext,
} from '@features/snail'
import { useGameStore } from '../model/store'

const PlayerSnail = () => {
  const moveable = useGameStore(s => s.moveable)

  const { appendPosition, appendRotation } = useSnailOrientationContext()
  const { sendTargetPosition, sendTargetRotation } = useLobbyEventsContext()

  const getRotation = useGetRotation()
  const calcAnimationDuration = useCalcAnimationDuration()
  const calcTargetPosition = useCalcTargetPosition()

  return (
    <playerDepsContext.Provider
      value={{
        isJumping: false,
        isMoveable: moveable,
        getRotation,
        calcTargetPosition,
        calcAnimationDuration: koef => calcAnimationDuration(0, koef),
        onJump: position => {
          appendPosition(position)
          sendTargetPosition({ position: { ...position, hold_time: position.holdTime } })
        },
        onRotate: rotation => {
          appendRotation(rotation)
          sendTargetRotation({ rotation })
        },
      }}>
      <Snail />
    </playerDepsContext.Provider>
  )
}

export default PlayerSnail
