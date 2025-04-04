import { useUser } from '@entities/user'
import { useIsConnectingLobby } from '@features/menu/model/use-connect-lobby'
import { useIsLobbyCreating } from '@features/menu/model/use-create-lobby'
import { useIsUserCreating } from '@features/menu/model/use-create-user'
import { useIsDisconnectingLobby } from '@features/menu/model/use-disconnect-lobby'
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

  const username = formData.watch('username')

  return (
    <>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => <UsernameInput {...props} />}
      />
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
  const { mode, visibility } = useMenu()
  const isConnecting = useIsConnectingLobby()
  const isDisconnecting = useIsDisconnectingLobby()
  const isLobbyCreating = useIsLobbyCreating()
  const isUserCreating = useIsUserCreating()

  if (isConnecting || isDisconnecting || isLobbyCreating || isUserCreating)
    return <div>Loading...</div>

  if (!visibility) return

  return <section className={css.menu}>{defineMenu[mode]}</section>
}
