import { useUser } from '@entities/user'
import { ReactNode, useState } from 'react'
import { MenuMode, useMenu } from '../../model/store'
import BackToLobbyButton from '../action-buttons/back-to-lobby-button'
import ContinueButton from '../action-buttons/continue-button'
import CreateLobbyButton from '../action-buttons/create-lobby-button'
import JoinLobbyButton from '../action-buttons/join-lobby-button'
import { Lobby } from '../lobby'
import UsernameInput from '../username-input'
import css from './menu.module.scss'

const MainMenu = () => {
  const user = useUser(s => s.user)

  const [username, setUsername] = useState(user?.username ?? '')

  return (
    <>
      <UsernameInput onChange={e => setUsername(e.currentTarget.value)} />
      <CreateLobbyButton username={username} />
      <JoinLobbyButton username={username} />
    </>
  )
}

const PauseMenu = () => {
  return (
    <>
      <ContinueButton />
      <BackToLobbyButton />
    </>
  )
}

const GameOver = () => {
  return <BackToLobbyButton />
}

const defineMenu: Record<MenuMode, ReactNode> = {
  'main-menu': <MainMenu />,
  lobby: <Lobby />,
  'game-pause': <PauseMenu />,
  'game-over': <GameOver />,
}

export const Menu = () => {
  const menuMode = useMenu(s => s.mode)

  return <section className={css.menu}>{defineMenu[menuMode]}</section>
}
