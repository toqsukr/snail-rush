import { useAppendLog } from '@features/logflow'
import { mainMenuDepsContext } from '@features/menu'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../pages/home/model/store'

const MainMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const updatePlayerStatus = useGameStore(s => s.updatePlayerStatus)
  const navigate = useNavigate()

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

  return (
    <mainMenuDepsContext.Provider value={{ onConnectLobby, onCreateLobby }}>
      {children}
    </mainMenuDepsContext.Provider>
  )
}

export default MainMenuLayout
