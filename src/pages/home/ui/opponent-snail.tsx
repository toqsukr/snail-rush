import { usePlayers } from '@entities/players'
import { TUser, useUser } from '@entities/user'
import { isObstacle } from '@features/obstacle'
import { Opponent, opponentDepsContext } from '@features/opponent-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { FC, Suspense, useMemo } from 'react'
import { getModelPath, getPlayerPosition, getPlayerSkin, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const OpponentSnail: FC<{ user: TUser }> = ({ user }) => {
  const { appendPosition, appendRotation } = useSnailContext()
  const players = usePlayers(s => s.players)
  const opponent = useMemo(() => players.filter(({ id }) => id !== user?.id)[0], [user, players])

  return (
    <opponentDepsContext.Provider
      value={{
        onJump: appendPosition,
        onRotate: value => {
          appendRotation(value)
        },
      }}>
      <Opponent>
        <Snail username={opponent.username} />
      </Opponent>
    </opponentDepsContext.Provider>
  )
}

const OpponentSuspense = () => {
  const user = useUser(s => s.user)
  const playerStatus = useGameStore(s => s.playerStatus)
  const players = usePlayers(s => s.players)

  if (!playerStatus || players.length < 2 || !user) return

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          shouldHandleCollision: isObstacle,
          modelPath: getModelPath(getPlayerSkin(playerStatus === 'joined' ? 'host' : 'joined')),
        }}>
        <SnailProvider
          initPosition={getStartPosition(
            getPlayerPosition(playerStatus === 'joined' ? 'host' : 'joined')
          )}
          initRotation={[0, Math.PI, 0]}>
          <OpponentSnail user={user} />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default OpponentSuspense
