import { usePlayers } from '@entities/players'
import { useUser } from '@entities/user'
import { isObstacle } from '@features/obstacle'
import { Opponent, opponentDepsContext } from '@features/opponent-control'
import {
  Snail,
  snailDepsContext,
  SnailOrientationProvider,
  useSnailOrientationContext,
} from '@features/snail'
import { Suspense } from 'react'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const OpponentSnail = () => {
  const { appendPosition, appendRotation } = useSnailOrientationContext()

  return (
    <opponentDepsContext.Provider
      value={{
        onJump: appendPosition,
        onRotate: appendRotation,
      }}>
      <Opponent>
        <Snail />
      </Opponent>
    </opponentDepsContext.Provider>
  )
}

const OpponentSuspense = () => {
  const playerStatus = useGameStore(s => s.playerStatus)
  const user = useUser(s => s.user)
  const players = usePlayers(s => s.players)

  if (!playerStatus || players.length < 2) return

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          shouldHandleCollision: isObstacle,
          modelPath: getModelPath(getPlayerSkin(playerStatus === 'joined' ? 'host' : 'joined')),
          username: players.filter(({ id }) => id !== user?.id)[0].username,
          startPosition: getStartPosition(
            getPlayerPosition(playerStatus === 'joined' ? 'host' : 'joined')
          ),
        }}>
        <SnailOrientationProvider>
          <OpponentSnail />
        </SnailOrientationProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default OpponentSuspense
