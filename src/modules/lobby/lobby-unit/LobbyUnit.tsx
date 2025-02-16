import { usePlayerData } from '@modules/player/store'
import { useKickPlayer } from '@modules/session/model/hooks/useKickPlayer'
import { useSession } from '@modules/session/store'
import { RxCross2 } from 'react-icons/rx'
import { useLobby } from '../store'
import css from './LobbyUnit.module.scss'

const LobbyUnit = () => {
  const { status } = useLobby()
  const { session } = useSession()
  const playerData = usePlayerData()
  const { kickPlayer } = useKickPlayer()
  return (
    <section className={css.lobby}>
      <h1>LOBBY</h1>
      <ol className={css.players}>
        {session?.players.map(({ player_id, username }) => (
          <li key={player_id} className={css.list_item}>
            <p>{username}</p>
            {player_id !== playerData.player_id && status === 'host' && (
              <RxCross2
                onClick={() => kickPlayer({ sessionID: session.session_id, playerID: player_id })}
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default LobbyUnit
