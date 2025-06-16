import { useIsHost } from '@features/auth/use-is-host'
import { useResetTimer, useStartTimer } from '@features/countdown'
import { useSendStartGame, useSendStopGame } from '@features/lobby-events'
import { useClearLogs } from '@features/logflow'
import { lobbyMenuDepsContext } from '@features/menu'
import { useFocusTo, useFollowTarget, useMoveTo } from '@features/tracking-camera'
import { FC, PropsWithChildren, Suspense } from 'react'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from '../../pages/home/lib/status'
import { MAIN_MENU_POSITION } from '../../pages/home/model/constants'
import { useGameStore } from '../../pages/home/model/store'

const LobbyMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const {
    resumeGame,
    pauseGame,
    toMainMenu,
    finished,
    startGame,
    playerStatus,
    updatePlayerStatus,
  } = useGameStore()
  const resetTimer = useResetTimer()
  const focusTo = useFocusTo()
  const moveTo = useMoveTo()
  const clearLogs = useClearLogs()
  const sendStopGame = useSendStopGame()
  const sendStartGame = useSendStartGame()
  const startTimer = useStartTimer()

  const followTarget = useFollowTarget()
  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))
  const checkHost = useIsHost()

  const onDisconnectLobby = () => {
    updatePlayerStatus(null)
    clearLogs()
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

  return (
    <Suspense>
      <lobbyMenuDepsContext.Provider
        value={{
          onPlay,
          onDeleteLobby,
          onBackToLobby,
          isHost: checkHost,
          onDisconnectLobby,
          onPause: pauseGame,
          onContinue: resumeGame,
        }}>
        {children}
      </lobbyMenuDepsContext.Provider>
    </Suspense>
  )
}

export default LobbyMenuLayout
