import { useSession } from '@entities/session'
import { useMenuDeps } from '@features/menu/deps'
import KickPlayerButton from '../action-buttons/kick-player-button'
import css from './lobby-board.module.scss'

const LobbyBoard = () => {
  const session = useSession(s => s.session)
  const { getUserByID } = useMenuDeps()

  return (
    <section className={css.lobby}>
      <h1>LOBBY</h1>
      <ul className={css.players}>
        {session?.players.map(playerID => (
          <li key={playerID} className={css.list_item}>
            <p>{getUserByID(playerID).username}</p>
            <KickPlayerButton lobbyPlayerID={playerID} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LobbyBoard
