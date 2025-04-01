import { useKickPlayer } from '@modules/session/model/hooks/useKickPlayer'
import { useSession } from '@modules/session/store'
import { FC } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useLobby } from '../store'
import css from './LobbyUnit.module.scss'

const LobbyUnit: FC<{ localPlayerID: string }> = ({ localPlayerID }) => {
  const { status } = useLobby()
  const { session } = useSession()
  const { kickPlayer } = useKickPlayer()
  return (
    <section className={css.lobby}>
      <h1>LOBBY</h1>
      <ol className={css.players}>
        {session?.players.map(lobbyPlayer => (
          <li key={lobbyPlayer.player_id} className={css.list_item}>
            <p>{lobbyPlayer.username}</p>
            {lobbyPlayer.player_id !== localPlayerID && status === 'host' && (
              <RxCross2
                onClick={() =>
                  kickPlayer({
                    sessionID: session.session_id,
                    actorID: localPlayerID,
                    dependentID: lobbyPlayer.player_id,
                  })
                }
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default LobbyUnit
