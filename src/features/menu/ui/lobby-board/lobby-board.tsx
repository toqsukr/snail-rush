import { FC } from 'react'
import { TbFlagCheck } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { TPlayer, usePlayerByID } from '@entities/players'
import { useSession } from '@entities/session'
import KickPlayerButton from '../action-buttons/kick-player-button'
import css from './lobby-board.module.scss'

const LobbyBoard = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()

  return (
    <section className={css.lobby}>
      <h1>{t('lobby_text')}</h1>
      <ul className={css.players}>
        {session?.players.map(({ id: playerID }) => (
          <li key={playerID} className={css.list_item}>
            <LobbyPlayer id={playerID} />
          </li>
        ))}
      </ul>
    </section>
  )
}

const LobbyPlayer: FC<Pick<TPlayer, 'id'>> = ({ id }) => {
  const { data: session } = useSession()
  const { data: player } = usePlayerByID(id)
  const sessionPlayer = session?.players.find(player => player.id === id)

  return (
    <>
      <p>
        {player?.username}: {session && session.score[id] ? session.score[id] : 0}
      </p>
      <div className='flex justify-center items-center gap-1'>
        {session?.hostID !== id && (
          <TbFlagCheck
            className='transition-opacity'
            style={{ opacity: sessionPlayer?.isReady ? 1 : 0.5 }}
          />
        )}
        <KickPlayerButton lobbyPlayerID={id} />
      </div>
    </>
  )
}

export default LobbyBoard
