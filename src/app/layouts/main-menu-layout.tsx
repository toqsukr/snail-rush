import { TSkin } from '@entities/skin'
import { invalidateUser, useUser } from '@entities/user'
import { useRegister } from '@features/auth'
import { useAppendLog } from '@features/logflow'
import { mainMenuDepsContext } from '@features/menu'
import { useUpdatePlayer } from '@features/menu/api/update-user'
import { useFocusTo } from '@features/tracking-camera'
import { MAIN_MENU_POSITION, SKIN_MENU_POSITION } from '@pages/home'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'
import { useGameStore } from '../../pages/home/model/store'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useUser()
  const updateToken = useToken(s => s.updateToken)
  const { t } = useTranslation()
  const focusTo = useFocusTo()
  const navigate = useNavigate()
  const { updatePlayerStatus } = useGameStore()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: updateUser } = useUpdatePlayer()

  const appendLog = useAppendLog()

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

  const onRegister = async (username: string, password: string) => {
    const { player, token } = await register({ username, password })
    // TODO
    const defaultSkinID = 'c696386d-38f2-44a1-a335-e8244fb57676'
    updateToken(token.access_token)
    await updateUser({
      id: player.player_id,
      username: player.username,
      skinID: defaultSkinID,
    })
    invalidateUser()
  }

  const onChangeSkin = async ({ name, skinID }: TSkin) => {
    if (!user) return
    await updateUser({ ...user, skinID })
    invalidateUser()
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
      }}>
      {children}
    </mainMenuDepsContext.Provider>
  )
}

export default MainMenuLayout
