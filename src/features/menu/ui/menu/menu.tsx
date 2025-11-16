import { useSession } from '@entities/session'
import { TSkin, useSkins } from '@entities/skin'
import { useUser } from '@entities/user'
import { useIsRegistering } from '@features/auth/api/use-register'
import { useIsFeedbackSending, useSendFeedback } from '@features/menu/api/send-feedback'
import { useLobbyMenuDeps, useMainMenuDeps } from '@features/menu/deps'
import { useCreateLobby } from '@features/menu/model/use-create-lobby'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@shared/uikit/button/Button'
import Input from '@shared/uikit/input/Input'
import Textarea from '@shared/uikit/textarea/textarea'
import { FC, FormEvent, PropsWithChildren, useState } from 'react'
import { Controller, ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useIsConnectingSession } from '../../api/connect-session'
import { useIsLobbyCreating } from '../../api/create-session'
import { useIsUserCreating } from '../../api/create-user'
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
import { useToggleReady } from '@features/menu/api/toggle-ready'
import { removeTokenEverywhere } from '@shared/config/token'
import { resetUser } from '@entities/user/query'
import { ClipboardText } from '@shared/uikit/clipboard-text/clipboard-text'
import UnderlinedText from '@shared/uikit/underlined-text/underlined-text'
import { useIsLogining } from '@features/auth/api/use-login'

const Menu: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const isConnecting = useIsConnectingSession()
  const isLobbyCreating = useIsLobbyCreating()
  const isUserCreating = useIsUserCreating()
  const isLogining = useIsLogining()
  const isRegistering = useIsRegistering()
  const isFeedbackSending = useIsFeedbackSending()
  const { isLoading: isUserLoading } = useUser()
  const { isLoading: isSkinsLoading } = useSkins()
  const { isLoading: isSessionLoading } = useSession()

  if (
    isLogining ||
    isRegistering ||
    isUserLoading ||
    isSessionLoading ||
    isConnecting ||
    isLobbyCreating ||
    isUserCreating ||
    isFeedbackSending ||
    isSkinsLoading
  )
    return <div>{t('loading_text')}</div>

  return (
    <section className='relative text-center'>
      <div className={css.menu}>{children}</div>
    </section>
  )
}

const MainMenuContent = () => {
  const { t } = useTranslation()
  const joinLobby = useJoinLobby()
  const { data: user } = useUser()
  const { visibility, mode, toSkins } = useMenu()
  const { data: session } = useSession()
  const { onToSkins } = useMainMenuDeps()
  const createLobby = useCreateLobby()

  const formData = useForm<{ username: string }>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
    resolver: zodResolver(z.object({ username: z.string().min(1).max(20) })),
  })

  const changeSkin = () => {
    toSkins()
    onToSkins()
  }

  // const leaveFeedback = () => {
  //   toFeedback()
  //   onToFeedback()
  // }

  const onExit = () => {
    removeTokenEverywhere()
    resetUser()
  }

  const username = formData.watch('username')

  const isActiveMenu = mode === 'main-menu'

  const renderUsernameInput = (field: ControllerRenderProps<{ username: string }, 'username'>) => {
    const { name, onBlur, onChange, value, disabled } = field
    const props = { name, onBlur, value, disabled }

    return (
      <UsernameInput
        {...props}
        onChange={e => {
          const value = e.currentTarget.value.slice(0, 20)
          onChange(value)
        }}
      />
    )
  }

  if (visibility && mode === 'join-lobby') return <JoinLobby />

  if (!visibility || !mode.includes('main-menu')) return

  return (
    <>
      {user && (
        <h1>{`${t('rating_text')}: ${(
          user.totalGames && (100 * user.wins) / user.totalGames
        ).toFixed(0)}%`}</h1>
      )}
      {user && <h1>{`${t('total_games_text')}: ${user.totalGames}`}</h1>}
      <Controller
        name='username'
        control={formData.control}
        disabled={!isActiveMenu}
        render={({ field }) => renderUsernameInput(field)}
      />
      <Button onClick={createLobby} disabled={!username.length || !isActiveMenu}>
        {session ? t('lobby_text') : t('create_lobby_text')}
      </Button>
      <Button onClick={joinLobby} disabled={!username.length || !!session || !isActiveMenu}>
        {t('join_text')}
      </Button>
      <Button onClick={changeSkin} disabled={!isActiveMenu}>
        {t('change_skin_text')}
      </Button>
      <Button onClick={onExit} disabled={!isActiveMenu}>
        {t('exit_text')}
      </Button>
      {/* <Button onClick={leaveFeedback} disabled={!isActiveMenu}>
        {t('leave_feedback_text')}
      </Button> */}
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
    if (skin.skinID !== user?.skinID) {
      onChangeSkin(skin)
    }
  }

  const isSelectedSkin = (skin: TSkin) => {
    return skin.skinID === user?.skinID
  }

  const isActiveMenu = mode === 'main-menu-skin'

  return (
    <Menu>
      <section className='bg-[black] rounded-[.4rem] p-[0.6rem]'>
        <ul className='flex flex-col gap-4'>
          {skins
            ?.filter(({ name }) => name.includes('.'))
            .map(skin => (
              <li key={skin.skinID}>
                <button
                  disabled={isSelectedSkin(skin) || !isActiveMenu}
                  style={{
                    cursor: skin.skinID !== user?.skinID ? 'pointer' : 'auto',
                    opacity: isSelectedSkin(skin) ? '1' : '',
                    color: isSelectedSkin(skin)
                      ? 'var(--primary-color)'
                      : 'rgba(255, 255, 255, .87)',
                  }}
                  className='flex w-full justify-between transition-opacity hover:opacity-80 focus-visible:opacity-80'
                  onClick={() => choseSkin(skin)}>
                  <div>{skin.name}</div>
                  <div>{isSelectedSkin(skin) && '●'}</div>
                </button>
              </li>
            ))}
        </ul>
      </section>
      <BackButton disabled={!isActiveMenu} />
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
      <div className='text-start'>{t('game_over_text')}</div>
      <div className='text-start'>
        {winnerName} {t('won_text')}!
      </div>
      <BackToLobbyButton />
    </Menu>
  )
}

export const LobbyMenu = () => {
  const { data: session } = useSession()
  const { data: user } = useUser()
  const { isHost } = useLobbyMenuDeps()
  const { visibility, mode } = useMenu()

  if (!visibility || mode !== 'lobby') return

  if (isHost(user?.id ?? '') && session) return <HostLobby lobbyCode={session.id} />

  return <JoinLobbyConnected />
}

export const HostLobby: FC<{ lobbyCode: string }> = ({ lobbyCode }) => {
  const { t } = useTranslation()
  const deleteLobby = useDeleteLobby()
  const { playAction, disabled } = usePlay()
  const { data: session } = useSession()
  const sessionOpponent = session?.players.find(({ id }) => id !== session?.hostID)

  const disableStartGame = disabled || !sessionOpponent?.isReady

  return (
    <Menu>
      <h1>
        {`${t('connect_tip_text')}:`}&nbsp;
        <ClipboardText text={lobbyCode} value={lobbyCode} />
      </h1>
      <LobbyBoard />
      <Button disabled={disableStartGame} onClick={playAction}>
        {t('play_text')}
      </Button>
      <Button onClick={deleteLobby}>{t('delete_lobby_text')}</Button>
      <BackButton />
    </Menu>
  )
}

const JoinLobbyFormDataSchema = z.object({ lobbyCode: z.string().min(4).max(4) })
type TJoinLobbyFormData = z.infer<typeof JoinLobbyFormDataSchema>

export const JoinLobby = () => {
  const { t } = useTranslation()
  const connectLobby = useConnectLobby()

  const formData = useForm<TJoinLobbyFormData>({
    resolver: zodResolver(JoinLobbyFormDataSchema),
  })

  const renderCodeInput = (field: ControllerRenderProps<TJoinLobbyFormData, 'lobbyCode'>) => {
    const { name, onBlur, onChange, value, disabled } = field
    const props = { name, onBlur, onChange, value, disabled }

    return <Input {...props} type='password' placeholder={t('lobby_code_input_placeholder')} />
  }

  const onSubmit = ({ lobbyCode }: TJoinLobbyFormData) => {
    connectLobby(lobbyCode)
  }

  return (
    <Menu>
      <form onSubmit={formData.handleSubmit(onSubmit)}>
        <Controller
          name='lobbyCode'
          control={formData.control}
          render={({ field }) => renderCodeInput(field)}
        />
        <Button type='submit' disabled={!formData.formState.isValid}>
          {t('connect_text')}
        </Button>
        <BackButton />
      </form>
    </Menu>
  )
}

export const JoinLobbyConnected = () => {
  const { t } = useTranslation()
  const disconnectYourself = useDisconnectLobby()
  const { data: user } = useUser()
  const { data: session } = useSession()
  const { mutateAsync: toggleReady } = useToggleReady()

  const sessionPlayer = session?.players.find(({ id }) => id === user?.id)

  const handleReady = async () => {
    toggleReady({ sessionID: session?.id ?? '', playerID: user?.id ?? '' })
  }

  return (
    <Menu>
      <LobbyBoard />
      <Button onClick={handleReady}>
        {sessionPlayer?.isReady ? t('not_ready_text') : t('ready_text')}
      </Button>
      <Button onClick={disconnectYourself}>{t('disconnect_text')}</Button>
    </Menu>
  )
}

const AuthFormDataSchema = z.object({
  username: z
    .string()
    .min(1)
    .transform(val => val.trim()),
  password: z
    .string()
    .min(5)
    .transform(val => val.trim()),
})

type TAuthFormData = z.infer<typeof AuthFormDataSchema>
type AuthMode = 'login' | 'register'

export const AuthMenu = () => {
  const { t } = useTranslation()
  const { onRegister, onLogin } = useMainMenuDeps()
  const { mode, toAuthUsername, backToMainMenu } = useMenu()
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  const toggleMode = () => {
    setAuthMode(prev => {
      if (prev === 'login') return 'register'
      return 'login'
    })
  }

  const formData = useForm<TAuthFormData>({
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(AuthFormDataSchema),
  })

  if (mode === 'auth-username') return <UsernameMenu formData={formData} />

  const renderPasswordInput = (field: ControllerRenderProps<TAuthFormData, 'password'>) => {
    const { name, onBlur, onChange, value, disabled } = field
    const props = { name, onBlur, onChange, value, disabled }

    return <Input {...props} type='password' placeholder={t('password_input_placeholder')} />
  }

  const defineAuthButtonText: Record<AuthMode, string> = {
    login: t('login_text'),
    register: t('register_text'),
  }

  const defineChangeModeText: Record<AuthMode, string> = {
    login: 'to_register_text',
    register: 'to_login_text',
  }

  const defineSubmitCallback: Record<AuthMode, (data: TAuthFormData) => void> = {
    login: onLogin,
    register: onRegister,
  }

  const onSubmit = ({ username, password }: TAuthFormData) => {
    backToMainMenu()

    defineSubmitCallback[authMode]({ username, password })
  }

  return (
    <Menu>
      <form onSubmit={formData.handleSubmit(onSubmit)}>
        <Controller
          name='password'
          control={formData.control}
          render={({ field }) => renderPasswordInput(field)}
        />
        <Button type='submit'>{defineAuthButtonText[authMode]}</Button>
        <Button onClick={toAuthUsername}>{t('back_text')}</Button>
      </form>
      <UnderlinedText onClick={toggleMode}>{t(defineChangeModeText[authMode])}</UnderlinedText>
    </Menu>
  )
}

const UsernameMenu: FC<{ formData: UseFormReturn<{ username: string; password: string }> }> = ({
  formData,
}) => {
  const { t } = useTranslation()
  const toAuthPassword = useMenu(s => s.toAuthPassword)

  const username = formData.watch('username')

  const renderUsernameInput = (field: ControllerRenderProps<TAuthFormData, 'username'>) => {
    const { name, onBlur, onChange, value, disabled } = field
    const props = { name, onBlur, value, disabled }

    return (
      <Input
        {...props}
        placeholder={t('username_input_placeholder')}
        onChange={e => {
          const value = e.currentTarget.value.slice(0, 20)
          onChange(value)
        }}
      />
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <Menu>
      <form onSubmit={handleSubmit}>
        <Controller
          name='username'
          control={formData.control}
          render={({ field }) => renderUsernameInput(field)}
        />
        <Button type='submit' onClick={toAuthPassword} disabled={!username.length}>
          {t('next_text')}
        </Button>
      </form>
    </Menu>
  )
}

const FeedbackFormDataSchema = z.object({ feedback: z.string().min(1) })
type TFeedbackFormData = z.infer<typeof FeedbackFormDataSchema>

export const FeedbackMenu = () => {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { mode, visibility } = useMenu()
  const { mutateAsync: sendFeedback } = useSendFeedback()
  const { onSendFeedback } = useMainMenuDeps()

  const formData = useForm<TFeedbackFormData>({
    mode: 'onChange',
    defaultValues: { feedback: '' },
    resolver: zodResolver(FeedbackFormDataSchema),
  })

  if (!visibility || !mode.includes('main-menu')) return

  const handleSendFeedback = async (data: TFeedbackFormData) => {
    if (!user) return
    await sendFeedback({ playerID: user.id, message: data.feedback })
    formData.reset()
    onSendFeedback()
  }

  return (
    <form onSubmit={formData.handleSubmit(handleSendFeedback)}>
      <Menu>
        <Controller
          control={formData.control}
          name='feedback'
          render={({ field }) => (
            <Textarea {...field} placeholder={t('feedback_input_placeholder')} />
          )}
        />
        <Button disabled={!formData.formState.isValid}>{t('send_text')}</Button>
        <BackButton />
      </Menu>
    </form>
  )
}
