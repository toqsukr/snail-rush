import { useIsHost } from '@features/auth/use-is-host'
import { useLobbyEventsContext } from '@features/lobby-events'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { menuDepsContext } from '@features/menu'
import { useTrackCameraContext } from '@features/tracking-camera'
import { FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from '../lib/status'
import { MAIN_MENU_POSITION } from '../model/constants'
import { useGameStore } from '../model/store'

export type MenuWithDepsProp = {
  startTimer: () => void
  resetTimer: () => void
}

const MenuLayout: FC<PropsWithChildren<MenuWithDepsProp>> = ({
  children,
  startTimer,
  resetTimer,
}) => {
  const checkHost = useIsHost()
  const { sendStartGame, sendStopGame } = useLobbyEventsContext()
  const clearLogs = useClearLogs()
  const appendLog = useAppendLog()

  const {
    finished,
    startGame,
    pauseGame,
    resumeGame,
    updatePlayerStatus,
    playerStatus,
    toMainMenu,
  } = useGameStore()

  const { followTarget, focusTo, moveTo } = useTrackCameraContext()

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  const onBackToLobby = async () => {
    resetTimer()
    toMainMenu()
    finished || sendStopGame()
    await moveTo([MAIN_MENU_POSITION[0], MAIN_MENU_POSITION[1], MAIN_MENU_POSITION[2] + 10])
    const tempStatus = playerStatus
    updatePlayerStatus(null)
    await focusTo(new Vector3(...MAIN_MENU_POSITION))
    updatePlayerStatus(tempStatus)
  }
  const onConnectLobby = () => {
    updatePlayerStatus('joined')
    appendLog('YOU were connected!')
  }

  const onDisconnectLobby = () => {
    updatePlayerStatus(null)
    clearLogs()
  }

  const onCreateLobby = () => {
    updatePlayerStatus('host')
    appendLog('Lobby was created!')
  }

  const onDeleteLobby = () => {
    updatePlayerStatus(null)
    clearLogs()
  }

  const onPlay = async () => {
    sendStartGame()
    startGame()
    await followTarget(new Vector3(...playerStartPosition))
    startTimer()
  }

  return (
    <menuDepsContext.Provider
      value={{
        isHost: checkHost,
        onPause: pauseGame,
        onContinue: resumeGame,
        onBackToLobby,
        onConnectLobby,
        onDisconnectLobby,
        onCreateLobby,
        onDeleteLobby,
        onPlay,
      }}>
      {children}
    </menuDepsContext.Provider>
  )
}

export default MenuLayout
