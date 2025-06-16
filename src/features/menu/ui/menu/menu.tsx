import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useLobbyMenuDeps } from '@features/menu/deps'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@shared/uikit/button/Button'
import Input from '@shared/uikit/input/Input'
import { FC, PropsWithChildren, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useIsConnectingSession } from '../../api/connect-session'
import { useIsLobbyCreating } from '../../api/create-session'
import { useIsUserCreating } from '../../api/create-user'
import { useIsDisconnectingSession } from '../../api/disconnect-session'
import { useMenu } from '../../model/store'
import { useConnectLobby } from '../../model/use-connect-lobby'
import { useContinue } from '../../model/use-continue'
import { useCreateLobby } from '../../model/use-create-lobby'
import { useDeleteLobby } from '../../model/use-delete-lobby'
import { useDisconnectLobby } from '../../model/use-disconnect-lobby'
import { useJoinLobby } from '../../model/use-join-lobby'
import { usePlay } from '../../model/use-play'
import BackButton from '../action-buttons/back-button'
import BackToLobbyButton from '../action-buttons/back-to-lobby-button'
import LobbyBoard from '../lobby-board/lobby-board'
import UsernameInput from '../username-input'
import css from './menu.module.scss'

const Menu: FC<PropsWithChildren> = ({ children }) => {
  const isConnecting = useIsConnectingSession()
  const isDisconnecting = useIsDisconnectingSession()
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
  const joinLobby = useJoinLobby()
  const user = useUser(s => s.user)
  const createLobby = useCreateLobby()
  const { visibility, mode } = useMenu()
  const session = useSession(s => s.session)

  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
    resolver: zodResolver(z.object({ username: z.string().min(1) })),
  })

  const username = formData.watch('username')

  console.log(visibility, mode)

  if (visibility && mode === 'join-lobby') return <JoinLobby />

  if (!visibility || mode !== 'main-menu') return

  return (
    <Menu>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => <UsernameInput {...props} />}
      />
      <Button onClick={() => createLobby(username)} disabled={!username.length}>
        {session ? 'LOBBY' : 'CREATE LOBBY'}
      </Button>

      <Button onClick={() => joinLobby(username)} disabled={!username.length || !!session}>
        JOIN
      </Button>
    </Menu>
  )
}

export const PauseMenu = () => {
  const continueGame = useContinue()

  const { visibility, mode } = useMenu()

  if (!visibility || mode !== 'game-pause') return

  return (
    <Menu>
      <Button onClick={continueGame}>CONTINUE</Button>
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

export const LobbyMenu = () => {
  const session = useSession(s => s.session)
  const user = useUser(s => s.user)
  const { isHost } = useLobbyMenuDeps()
  const { visibility, mode } = useMenu()

  if (!visibility || mode !== 'lobby') return

  if (isHost(user?.id ?? '') && session) return <HostLobby sessionID={session.id} />

  return <JoinLobbyConnected />
}

export const HostLobby: FC<{ sessionID: string }> = ({ sessionID }) => {
  const deleteLobby = useDeleteLobby()
  const { playAction, disabled } = usePlay()
  return (
    <Menu>
      <h1>Let your friend connect by code: {sessionID}</h1>
      <LobbyBoard />
      <Button disabled={disabled} onClick={playAction}>
        PLAY
      </Button>
      <Button onClick={deleteLobby}>DELETE LOBBY</Button>
      <BackButton />
    </Menu>
  )
}

export const JoinLobby = () => {
  const [lobbyCode, setLobbyCode] = useState('')
  const connectLobby = useConnectLobby()

  return (
    <Menu>
      <Input
        value={lobbyCode}
        onChange={e => setLobbyCode(e.currentTarget.value)}
        placeholder='Lobby code'
      />
      <Button disabled={lobbyCode.length !== 4} onClick={() => connectLobby(lobbyCode)}>
        CONNECT
      </Button>
      <BackButton />
    </Menu>
  )
}

export const JoinLobbyConnected = () => {
  const disconnectYourself = useDisconnectLobby()

  return (
    <Menu>
      <LobbyBoard />
      <Button onClick={disconnectYourself}>DISCONNECT</Button>
    </Menu>
  )
}
