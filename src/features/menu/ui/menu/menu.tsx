import { useSession } from '@entities/session'
import { TSkin, useSkins } from '@entities/skin'
import { useUser } from '@entities/user'
import { useLobbyMenuDeps, useMainMenuDeps } from '@features/menu/deps'
import { useChangeSkin } from '@features/menu/model/use-change-skin'
import { useCreateLobby } from '@features/menu/model/use-create-lobby'
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
  const { isLoading: isSkinsLoading } = useSkins()

  if (isConnecting || isDisconnecting || isLobbyCreating || isUserCreating || isSkinsLoading)
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
  const { visibility, mode } = useMenu()
  const session = useSession(s => s.session)
  const changeSkin = useChangeSkin()
  const { onToSkins } = useMainMenuDeps()
  const createLobby = useCreateLobby()

  const toSkins = () => {
    changeSkin()
    onToSkins()
  }

  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
    resolver: zodResolver(z.object({ username: z.string().min(1) })),
  })

  const username = formData.watch('username')

  if (visibility && mode === 'join-lobby') return <JoinLobby />

  if (!visibility || !mode.includes('main-menu')) return

  return (
    <Menu>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => <UsernameInput {...props} />}
      />
      <Button onClick={createLobby} disabled={!username.length || mode !== 'main-menu'}>
        {session ? 'LOBBY' : 'CREATE LOBBY'}
      </Button>

      <Button onClick={joinLobby} disabled={!username.length || !!session || mode !== 'main-menu'}>
        JOIN
      </Button>

      <Button onClick={toSkins} disabled={mode !== 'main-menu'}>
        CHANGE SKIN
      </Button>
    </Menu>
  )
}

export const SkinMenu = () => {
  const { visibility, mode } = useMenu()
  const { onChangeSkin } = useMainMenuDeps()
  const { data: skins } = useSkins()
  const user = useUser(s => s.user)

  if (!visibility || !mode.includes('main-menu')) return

  const choseSkin = (skin: TSkin) => {
    skin.skinID !== user?.skinID && onChangeSkin(skin)
  }

  return (
    <Menu>
      <section className='bg-[black] rounded-[.4rem] p-[0.6rem]'>
        <ul className='flex flex-col gap-4'>
          {skins
            ?.filter(({ name }) => name.includes('.'))
            .map(skin => (
              <li
                key={skin.skinID}
                style={{ cursor: skin.skinID !== user?.skinID ? 'pointer' : 'auto' }}
                className='flex justify-between hover:opacity-80 transition-opacity'
                onClick={() => choseSkin(skin)}>
                <div>{skin.name}</div>
                <div>{skin.skinID === user?.skinID && '●'}</div>
              </li>
            ))}
        </ul>
      </section>
      <BackButton />
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

export const AuthMenu = () => {
  const { mode, toAuthUsername, backToMainMenu } = useMenu()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { onRegister } = useMainMenuDeps()

  const formData = useForm<{ password: string }>({
    mode: 'onChange',
    defaultValues: { password },
    resolver: zodResolver(z.object({ password: z.string().min(5) })),
  })

  if (mode === 'auth-username')
    return <UsernameMenu username={username} updateUsername={username => setUsername(username)} />

  const onInputChange = (
    e: React.FormEvent<HTMLInputElement>,
    controllerChange: (...event: any[]) => void
  ) => {
    controllerChange(e)
    setPassword(e.currentTarget.value)
  }

  const onRegisterClick = () => {
    backToMainMenu()
    onRegister(username, password)
  }

  return (
    <Menu>
      <Controller
        name='password'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => (
          <Input
            {...props}
            onChange={e => onInputChange(e, props.onChange)}
            placeholder='Enter password'
          />
        )}
      />
      <Button onClick={onRegisterClick} disabled={!password.length}>
        REGISTER
      </Button>
      <Button onClick={toAuthUsername}>BACK</Button>
    </Menu>
  )
}

const UsernameMenu: FC<{ username: string; updateUsername: (username: string) => void }> = ({
  username,
  updateUsername,
}) => {
  const toAuthPassword = useMenu(s => s.toAuthPassword)
  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username },
    resolver: zodResolver(z.object({ username: z.string().min(1) })),
  })

  const onInputChange = (
    e: React.FormEvent<HTMLInputElement>,
    controllerChange: (...event: any[]) => void
  ) => {
    controllerChange(e)
    updateUsername(e.currentTarget.value)
  }

  return (
    <Menu>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => (
          <Input
            {...props}
            onChange={e => onInputChange(e, props.onChange)}
            placeholder='Enter username'
          />
        )}
      />
      <Button onClick={toAuthPassword} disabled={!username.length}>
        NEXT
      </Button>
    </Menu>
  )
}
