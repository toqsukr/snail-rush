import { isObstacle } from '@features/obstacle'
import { opponentDepsContext } from '@features/opponent-control'
import { Snail, snailDepsContext, useSnailOrientationContext } from '@features/snail'

const OPPONENT_START_POSITION = [6, 0, 0] satisfies [number, number, number]

const OpponentSnail = () => {
  const { appendPosition, appendRotation } = useSnailOrientationContext()

  return (
    <snailDepsContext.Provider
      value={{
        modelPath: '/animations/full-jump-static-opponent.glb',
        shouldHandleCollision: isObstacle,
        startPosition: OPPONENT_START_POSITION,
      }}>
      <opponentDepsContext.Provider
        value={{
          onJump: appendPosition,
          onRotate: appendRotation,
        }}>
        <Snail />
      </opponentDepsContext.Provider>
    </snailDepsContext.Provider>
  )
}

export default OpponentSnail
