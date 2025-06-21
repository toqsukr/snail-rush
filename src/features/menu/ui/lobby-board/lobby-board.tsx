import { TPlayer, usePlayerByID } from '@entities/players'
import { useSession } from '@entities/session'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import KickPlayerButton from '../action-buttons/kick-player-button'
import css from './lobby-board.module.scss'

const LobbyBoard = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()

  return (
    <section className={css.lobby}>
      <h1>{t('lobby_text')}</h1>
      <ul className={css.players}>
        {session?.players.map(playerID => (
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

  // const handleCheckClick = () => {
  //   if (user?.id !== id) return
  //   toggleReady({ sessionID: session?.id ?? '', playerID: id })
  // }

  return (
    <>
      <p>
        {player?.username}: {session && session.score[id] ? session.score[id] : 0}
      </p>
      <div className='flex justify-center items-center gap-1'>
        {/* <FaCheck
          onClick={handleCheckClick}
          className='transition-opacity cursor-pointer'
          style={{ opacity: player?.isReady ? 1 : 0.7 }}
        /> */}
        <KickPlayerButton lobbyPlayerID={id} />
      </div>
    </>
  )
}

export default LobbyBoard
