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
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'
import { useGameStore } from '../../pages/home/model/store'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const { updatePlayerStatus } = useGameStore()
  const navigate = useNavigate()
  const focusTo = useFocusTo()
  const userStore = useUser()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: updateUser } = useUpdatePlayer()

  const appendLog = useAppendLog()

  const onConnectLobby = (userID: string, sessionID: string) => {
    navigate(Routes.LOBBY, { state: { userID, sessionID } })
    updatePlayerStatus('joined')
    appendLog('YOU were connected!')
  }

  const onCreateLobby = (userID: string, sessionID: string) => {
    navigate(Routes.LOBBY, { state: { userID, sessionID } })
    updatePlayerStatus('host')
    appendLog('Lobby was created!')
  }

  const onBackToMainMenu = async () => {
    await focusTo(new Vector3(...MAIN_MENU_POSITION))
  }

  const onToSkins = async () => {
    await focusTo(new Vector3(...SKIN_MENU_POSITION))
  }

  const onRegister = async (username: string, password: string) => {
    const userData = await register({ username, password })
    // TODO
    const defaultSkinID = 'b5d45580-e087-4e55-b356-0b6e1ced52d5'
    await updateUser({ ...userData, skinID: defaultSkinID })

    userStore.updateUser({ ...userData, skinID: defaultSkinID })
  }

  const onChangeSkin = async ({ name, skinID }: TSkin) => {
    if (!userStore.user) return
    await updateUser({ ...userStore.user, skinID })
    userStore.updateUser({ ...userStore.user, skinID })
    appendLog(`YOU changed skin to ${name}!`)
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
