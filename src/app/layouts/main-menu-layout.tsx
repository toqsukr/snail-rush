import { TSkin } from '@entities/skin'
import { useUser } from '@entities/user'
import { useRegister } from '@features/auth'
import { useAppendLog } from '@features/logflow'
import { mainMenuDepsContext } from '@features/menu'
import { useUpdatePlayer } from '@features/menu/api/update-user'
import { useFocusTo } from '@features/tracking-camera'
import { MAIN_MENU_POSITION, SKIN_MENU_POSITION } from '@pages/home'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'
import { useGameStore } from '../../pages/home/model/store'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const userStore = useUser()
  const { t } = useTranslation()
  const focusTo = useFocusTo()
  const navigate = useNavigate()
  const { updatePlayerStatus } = useGameStore()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: updateUser } = useUpdatePlayer()

  const appendLog = useAppendLog()

  const onConnectLobby = (userID: string, sessionID: string) => {
    navigate(Routes.LOBBY, { state: { userID, sessionID } })
    updatePlayerStatus('joined')
    appendLog(t('you_connected_lobby_text'))
  }

  const onCreateLobby = (userID: string, sessionID: string) => {
    navigate(Routes.LOBBY, { state: { userID, sessionID } })
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
    const defaultSkinID = 'b5d45580-e087-4e55-b356-0b6e1ced52d5'
    await updateUser({
      id: player.player_id,
      token: token.access_token,
      username: player.username,
      skinID: defaultSkinID,
    })

    userStore.updateUser({
      id: player.player_id,
      token: token.access_token,
      username: player.username,
      skinID: defaultSkinID,
    })
  }

  const onChangeSkin = async ({ name, skinID }: TSkin) => {
    if (!userStore.user) return
    await updateUser({ ...userStore.user, skinID })
    userStore.updateUser({ ...userStore.user, skinID })
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
