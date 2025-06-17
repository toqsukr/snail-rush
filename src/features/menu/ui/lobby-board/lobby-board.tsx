import { usePlayers } from '@entities/players'
import { useTranslation } from 'react-i18next'
import KickPlayerButton from '../action-buttons/kick-player-button'
import css from './lobby-board.module.scss'

const LobbyBoard = () => {
  const lobbyPlayers = usePlayers(s => s.players)
  const { t } = useTranslation()

  return (
    <section className={css.lobby}>
      <h1>{t('lobby_text')}</h1>
      <ul className={css.players}>
        {lobbyPlayers.map(({ id, username }) => (
          <li key={id} className={css.list_item}>
            <p>{username}</p>
            <KickPlayerButton lobbyPlayerID={id} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LobbyBoard
