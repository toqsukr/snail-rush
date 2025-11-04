import { TSkin } from '@entities/skin'
import { invalidateUser, useUser } from '@entities/user'
import { useLogin, useRegister } from '@features/auth'
import { useAppendLog } from '@features/logflow'
import { mainMenuDepsContext } from '@features/menu'
import { useUpdatePlayer } from '@features/menu/api/update-user'
import { useFocusTo } from '@features/tracking-camera'
import { MAIN_MENU_POSITION, SKIN_MENU_POSITION } from '@pages/home'
import { FEEDBACK_MENU_POSITION } from '@pages/home/ui/feedback-menu'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'
import { useGameStore } from '../../pages/home/model/store'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const focusTo = useFocusTo()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: user } = useUser()
  const appendLog = useAppendLog()
  const { updatePlayerStatus } = useGameStore()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: login } = useLogin()
  const updateToken = useToken(s => s.updateToken)
  const { mutateAsync: updateUser } = useUpdatePlayer()

  const onConnectLobby = () => {
    navigate(Routes.LOBBY)
    updatePlayerStatus('joined')
    appendLog(t('you_connected_lobby_text'))
  }

  const onCreateLobby = () => {
    navigate(Routes.LOBBY)
    updatePlayerStatus('host')
    appendLog(t('lobby_created_text'))
  }

  const onBackToMainMenu = async () => {
    await focusTo(new Vector3(...MAIN_MENU_POSITION))
  }

  const onToSkins = async () => {
    await focusTo(new Vector3(...SKIN_MENU_POSITION))
  }

  const onToFeedback = async () => {
    await focusTo(new Vector3(...FEEDBACK_MENU_POSITION))
  }

  const onLogin = async (username: string, password: string) => {
    const { access_token } = await login({ username, password })

    updateToken(access_token)
  }

  const onRegister = async (username: string, password: string) => {
    const { token } = await register({ username, password })

    updateToken(token.access_token)
    // await updateUser(parseFromRegisterDTO(player))
    // invalidateUser()
  }

  const onChangeSkin = async ({ name, skinID }: TSkin) => {
    if (!user) return
    await updateUser({ id: user.id, username: user.username, skinID })
    invalidateUser()
    appendLog(`${t('you_changed_skin_text')} ${name}!`)
  }

  const onSendFeedback = () => {
    appendLog(`${t('feedback_delivered_text')}!`)
  }

  return (
    <mainMenuDepsContext.Provider
      value={{
        onConnectLobby,
        onCreateLobby,
        onToSkins,
        onToFeedback,
        onSendFeedback,
        onBackToMainMenu,
        onChangeSkin,
        onRegister,
        onLogin,
      }}>
      {children}
    </mainMenuDepsContext.Provider>
  )
}

export default MainMenuLayout
