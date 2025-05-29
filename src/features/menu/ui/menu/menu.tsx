import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useMenuDeps } from '@features/menu/deps'
import { useIsConnectingLobby } from '@features/menu/model/use-connect-lobby'
import { useIsLobbyCreating } from '@features/menu/model/use-create-lobby'
import { useIsUserCreating } from '@features/menu/model/use-create-user'
import { useIsDisconnectingLobby } from '@features/menu/model/use-disconnect-lobby'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@shared/uikit/input/Input'
import { FC, PropsWithChildren, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMenu } from '../../model/store'
import BackButton from '../action-buttons/back-button'
import BackToLobbyButton from '../action-buttons/back-to-lobby-button'
import ConnectLobbyButton from '../action-buttons/connect-lobby-button'
import ContinueButton from '../action-buttons/continue-button'
import CreateLobbyButton from '../action-buttons/create-lobby-button'
import DeleteLobbyButton from '../action-buttons/delete-lobby-button'
import DisconnectButton from '../action-buttons/disconnect-button'
import JoinLobbyButton from '../action-buttons/join-lobby-button'
import PlayGameButton from '../action-buttons/play-game-button'
import LobbyBoard from '../lobby-board/lobby-board'
import UsernameInput from '../username-input'
import css from './menu.module.scss'

const Menu: FC<PropsWithChildren> = ({ children }) => {
  const isConnecting = useIsConnectingLobby()
  const isDisconnecting = useIsDisconnectingLobby()
  const isLobbyCreating = useIsLobbyCreating()
  const isUserCreating = useIsUserCreating()

  if (isConnecting || isDisconnecting || isLobbyCreating || isUserCreating)
    return <div>Loading...</div>

  return (
    <section className='h-full relative'>
      <div className={css.menu}>{children}</div>
    </section>
  )
}

export const MainMenu = () => {
  const user = useUser(s => s.user)
  const mode = useMenu(s => s.mode)
  const { visibility } = useMenu()

  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
    resolver: zodResolver(z.object({ username: z.string().min(1) })),
  })

  const username = formData.watch('username')

  if (!visibility) return

  if (mode === 'lobby') return <Lobby />

  return (
    <Menu>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => <UsernameInput {...props} />}
      />
      <CreateLobbyButton username={username} />
      <JoinLobbyButton username={username} />
    </Menu>
  )
}

export const PauseMenu = () => {
  const { visibility } = useMenu()

  if (!visibility) return

  return (
    <Menu>
      <ContinueButton />
      <BackToLobbyButton />
    </Menu>
  )
}

export const GameOver: FC<{ winnerName: string }> = ({ winnerName }) => {
  return (
    <Menu>
      <div>GAME OVER!</div>
      <div>{winnerName} WON!</div>
      <BackToLobbyButton />
    </Menu>
  )
}

export const Lobby = () => {
  const session = useSession(s => s.session)
  const user = useUser(s => s.user)
  const { isHost } = useMenuDeps()

  if (isHost(user?.id ?? '') && session) return <HostLobby sessionID={session.id} />

  if (session) return <JoinLobbyConnected />

  return <JoinLobby />
}

export const HostLobby: FC<{ sessionID: string }> = ({ sessionID }) => {
  return (
    <Menu>
      <h1>Let your friend connect by code: {sessionID}</h1>
      <LobbyBoard />
      <PlayGameButton />
      <DeleteLobbyButton />
      <BackButton />
    </Menu>
  )
}

export const JoinLobby = () => {
  const [lobbyCode, setLobbyCode] = useState('')

  return (
    <Menu>
      <Input
        value={lobbyCode}
        onChange={e => setLobbyCode(e.currentTarget.value)}
        placeholder='Lobby code'
      />
      <ConnectLobbyButton lobbyCode={lobbyCode} disabled={lobbyCode.length !== 4} />
      <BackButton />
    </Menu>
  )
}

export const JoinLobbyConnected = () => {
  return (
    <Menu>
      <LobbyBoard />
      <DisconnectButton />
    </Menu>
  )
}
