import { usePlayerByID } from '@entities/players'
import { useSession } from '@entities/session'
import { useSkinById } from '@entities/skin/query'
import { TUser, useUser } from '@entities/user'
import { opponentPositionEmitter, opponentRotationEmitter } from '@features/opponent-control'
import { Snail, snailDepsContext, SnailProvider } from '@features/snail'
import { FC, Suspense } from 'react'
import { getPlayerPosition, getStartPosition, getTexturePath, PlayerSkins } from '../lib/status'
import { useGameStore } from '../model/store'
import { MAX_SPACE_HOLD_TIME, STUN_TIMEOUT } from '@shared/config/game'
import { Euler } from 'three'
import { isObstacle } from '@shared/lib/game/obstacle'

const OpponentSnail: FC<{ user: TUser }> = ({ user }) => {
  const { data: session } = useSession()
  const opponentID = session?.players.find(id => id !== user?.id)
  const { data: opponent } = usePlayerByID(opponentID ?? '')

  return <Snail username={opponent?.username} />
}

const OpponentSuspense = () => {
  const { data: user } = useUser()
  const playerStatus = useGameStore(s => s.playerStatus)
  const { data: session } = useSession()
  const opponentID = session?.players.find(id => id !== user?.id)
  const { data: opponentPlayer } = usePlayerByID(opponentID ?? '')
  const { data: skin } = useSkinById(opponentPlayer?.skinID ?? '')

  if (!playerStatus || (session?.players.length ?? 0) < 2 || !user) return

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  return (
    <Suspense fallback={null}>
      <snailDepsContext.Provider
        value={{
          positionEmitter: opponentPositionEmitter,
          rotationEmitter: opponentRotationEmitter,
          stunTimeout: STUN_TIMEOUT,
          shouldHandleCollision: isObstacle,
          shrinkDuration: MAX_SPACE_HOLD_TIME,
          texturePath,
        }}>
        <SnailProvider
          initPosition={getStartPosition(
            getPlayerPosition(playerStatus === 'joined' ? 'host' : 'joined')
          )}
          initRotation={new Euler(0, Math.PI, 0)}>
          <OpponentSnail user={user} />
        </SnailProvider>
      </snailDepsContext.Provider>
    </Suspense>
  )
}

export default OpponentSuspense
