import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'

import { MAIN_MENU_POSITION, SKIN_MENU_POSITION } from '@pages/home'
import { useLogin, useRegister, useIsLogining, useIsRegistering } from '@features/auth'
import { useGameStore } from '@features/game'
import { useAppendLog } from '@features/logflow'
import { mainMenuDepsContext } from '@features/menu'
import { useFocusTo } from '@features/tracking-camera'
import { TSkin } from '@entities/skin'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const focusTo = useFocusTo()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const appendLog = useAppendLog()
  const { updatePlayerStatus } = useGameStore()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: login } = useLogin()
  const isLogining = useIsLogining()
  const isRegistering = useIsRegistering()
  const updateToken = useToken(s => s.updateToken)

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

  const onLogin = async (data: { username: string; password: string }) => {
    const { access_token } = await login(data)

    updateToken(access_token)
  }

  const onRegister = async (data: { username: string; password: string }) => {
    const { token } = await register(data)

    updateToken(token.access_token)
  }

  const onChangeSkin = async ({ name }: TSkin) => {
    appendLog(`${t('you_changed_skin_text')} ${name}!`)
  }

  return (
    <mainMenuDepsContext.Provider
      value={{
        onConnectLobby,
        onCreateLobby,
        onToSkins,
        onBackToMainMenu,
        onChangeSkin,
        onRegister,
        onLogin,
        isLoading: isRegistering || isLogining,
      }}>
      {children}
    </mainMenuDepsContext.Provider>
  )
}

export default MainMenuLayout
