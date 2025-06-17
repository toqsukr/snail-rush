import { usePlayers } from '@entities/players'
import { useSkinById } from '@entities/skin/query'
import { TUser, useUser } from '@entities/user'
import { isObstacle } from '@features/obstacle'
import { Opponent, opponentDepsContext } from '@features/opponent-control'
import { Snail, snailDepsContext, SnailProvider, useSnailContext } from '@features/snail'
import { FC, Suspense, useMemo } from 'react'
import { getPlayerPosition, getStartPosition, getTexturePath, PlayerSkins } from '../lib/status'
import { useGameStore } from '../model/store'
import { MAX_SPACE_HOLD_TIME, STUN_TIMEOUT } from './player-snail'

const OpponentSnail: FC<{ user: TUser }> = ({ user }) => {
  const { appendPosition, appendRotation } = useSnailContext()
  const players = usePlayers(s => s.players)
  const opponent = useMemo(() => players.filter(({ id }) => id !== user?.id)[0], [user, players])

  return (
    <opponentDepsContext.Provider
      value={{
        onJump: appendPosition,
        onRotate: rotation => {
          appendRotation(rotation)
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
  const opponentPlayer = players.find(({ id }) => id !== user?.id)
  const { data: skin } = useSkinById(opponentPlayer?.skinID ?? '')

  if (!playerStatus || players.length < 2 || !user) return

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          stunTimeout: STUN_TIMEOUT,
          shouldHandleCollision: isObstacle,
          shrinkDuration: MAX_SPACE_HOLD_TIME,
          texturePath,
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
