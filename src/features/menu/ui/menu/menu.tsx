import { useSession } from '@entities/session'
import { TSkin, useSkins } from '@entities/skin'
import { useUser } from '@entities/user'
import { useIsRegistering } from '@features/auth/api/use-register'
import { useLobbyMenuDeps, useMainMenuDeps } from '@features/menu/deps'
import { useChangeSkin } from '@features/menu/model/use-change-skin'
import { useCreateLobby } from '@features/menu/model/use-create-lobby'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@shared/uikit/button/Button'
import Input from '@shared/uikit/input/Input'
import { FC, PropsWithChildren, useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const isConnecting = useIsConnectingSession()
  const isDisconnecting = useIsDisconnectingSession()
  const isLobbyCreating = useIsLobbyCreating()
  const isUserCreating = useIsUserCreating()
  const isRegistering = useIsRegistering()
  const { isLoading: isUserLoading } = useUser()
  const { isLoading: isSkinsLoading } = useSkins()

  if (
    isRegistering ||
    isUserLoading ||
    isConnecting ||
    isDisconnecting ||
    isLobbyCreating ||
    isUserCreating ||
    isSkinsLoading
  )
    return <div>{t('loading_text')}</div>

  return (
    <section className='h-full relative'>
      <div className={css.menu}>{children}</div>
    </section>
  )
}

const MainMenuContent = () => {
  const { t } = useTranslation()
  const joinLobby = useJoinLobby()
  const { data: user } = useUser()
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
    <>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => <UsernameInput {...props} />}
      />
      <Button onClick={createLobby} disabled={!username.length || mode !== 'main-menu'}>
        {session ? t('lobby_text') : t('create_lobby_text')}
      </Button>
      <Button onClick={joinLobby} disabled={!username.length || !!session || mode !== 'main-menu'}>
        {t('join_text')}
      </Button>
      <Button onClick={toSkins} disabled={mode !== 'main-menu'}>
        {t('change_skin_text')}
      </Button>
    </>
  )
}

export const MainMenu = () => {
  return (
    <Menu>
      <MainMenuContent />
    </Menu>
  )
}

export const SkinMenu = () => {
  const { visibility, mode } = useMenu()
  const { onChangeSkin } = useMainMenuDeps()
  const { data: skins } = useSkins()
  const { data: user } = useUser()

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
  const { t } = useTranslation()
  const continueGame = useContinue()

  const { visibility, mode } = useMenu()

  if (!visibility || mode !== 'game-pause') return

  return (
    <Menu>
      <Button onClick={continueGame}>{t('continue_text')}</Button>
      <BackToLobbyButton />
    </Menu>
  )
}

export const GameOver: FC<{ winnerName: string }> = ({ winnerName }) => {
  const { t } = useTranslation()

  return (
    <Menu>
      <div>{t('game_over_text')}</div>
      <div>
        {winnerName} {t('won_text')}!
      </div>
      <BackToLobbyButton />
    </Menu>
  )
}

export const LobbyMenu = () => {
  const session = useSession(s => s.session)
  const { data: user } = useUser()
  const { isHost } = useLobbyMenuDeps()
  const { visibility, mode } = useMenu()

  if (!visibility || mode !== 'lobby') return

  if (isHost(user?.id ?? '') && session) return <HostLobby sessionID={session.id} />

  return <JoinLobbyConnected />
}

export const HostLobby: FC<{ sessionID: string }> = ({ sessionID }) => {
  const { t } = useTranslation()
  const deleteLobby = useDeleteLobby()
  const { playAction, disabled } = usePlay()
  return (
    <Menu>
      <h1>
        {t('connect_tip_text')}: {sessionID}
      </h1>
      <LobbyBoard />
      <Button disabled={disabled} onClick={playAction}>
        {t('play_text')}
      </Button>
      <Button onClick={deleteLobby}>{t('delete_lobby_text')}</Button>
      <BackButton />
    </Menu>
  )
}

export const JoinLobby = () => {
  const { t } = useTranslation()
  const connectLobby = useConnectLobby()
  const [lobbyCode, setLobbyCode] = useState('')

  return (
    <Menu>
      <Input
        value={lobbyCode}
        onChange={e => setLobbyCode(e.currentTarget.value)}
        placeholder={t('lobby_code_input_placeholder')}
      />
      <Button disabled={lobbyCode.length !== 4} onClick={() => connectLobby(lobbyCode)}>
        {t('connect_text')}
      </Button>
      <BackButton />
    </Menu>
  )
}

export const JoinLobbyConnected = () => {
  const { t } = useTranslation()
  const disconnectYourself = useDisconnectLobby()

  return (
    <Menu>
      <LobbyBoard />
      <Button onClick={disconnectYourself}>{t('disconnect_text')}</Button>
    </Menu>
  )
}

export const AuthMenu = () => {
  const { t } = useTranslation()
  const { onRegister } = useMainMenuDeps()
  const { mode, toAuthUsername, backToMainMenu } = useMenu()

  const formData = useForm<{ username: string; password: string }>({
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(z.object({ username: z.string().min(1), password: z.string().min(5) })),
  })

  if (mode === 'auth-username') return <UsernameMenu formData={formData} />

  const username = formData.watch('username')
  const password = formData.watch('password')

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
          <Input {...props} placeholder={t('password_input_placeholder')} />
        )}
      />
      <Button onClick={onRegisterClick} disabled={!password.length}>
        {t('register_text')}
      </Button>
      <Button onClick={toAuthUsername}>{t('back_text')}</Button>
    </Menu>
  )
}

const UsernameMenu: FC<{ formData: UseFormReturn<{ username: string; password: string }> }> = ({
  formData,
}) => {
  const { t } = useTranslation()
  const toAuthPassword = useMenu(s => s.toAuthPassword)

  const username = formData.watch('username')

  return (
    <Menu>
      <Controller
        name='username'
        control={formData.control}
        render={({ field: { ref: _ref, ...props } }) => (
          <Input {...props} placeholder={t('username_input_placeholder')} />
        )}
      />
      <Button onClick={toAuthPassword} disabled={!username.length}>
        {t('next_text')}
      </Button>
    </Menu>
  )
}
