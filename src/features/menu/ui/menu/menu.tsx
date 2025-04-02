import { useUser } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
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

  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
    resolver: zodResolver(z.object({ username: z.string().min(1) })),
  })

  return (
    <>
      <Controller
        control={formData.control}
        name='username'
        render={({ field }) => <UsernameInput {...field} />}
      />
      <CreateLobbyButton username={user?.username ?? ''} />
      <JoinLobbyButton username={user?.username ?? ''} />
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
