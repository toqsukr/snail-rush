import { usePlayers } from '@entities/players'
import { useUser } from '@entities/user'
import { isObstacle } from '@features/obstacle'
import { Opponent, opponentDepsContext } from '@features/opponent-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { Suspense } from 'react'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const OpponentSnail = () => {
  const { appendPosition, appendRotation } = useSnailContext()

  return (
    <opponentDepsContext.Provider
      value={{
        onJump: appendPosition,
        onRotate: value => {
          appendRotation(value)
        },
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
          username: players.filter(({ id }) => id !== user?.id)[0].username,
          modelPath: getModelPath(getPlayerSkin(playerStatus === 'joined' ? 'host' : 'joined')),
          startPosition: getStartPosition(
            getPlayerPosition(playerStatus === 'joined' ? 'host' : 'joined')
          ),
        }}>
        <SnailProvider>
          <OpponentSnail />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default OpponentSuspense
