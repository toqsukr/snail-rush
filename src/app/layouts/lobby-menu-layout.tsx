import { invalidateSession, useSession } from '@entities/session'
import { useIsHost } from '@features/auth/model/use-is-host'
import { useResetTimer, useStartTimer } from '@features/countdown'
import { useSendKick, useSendStartGame, useSendStopGame } from '@features/lobby-events'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { lobbyMenuDepsContext } from '@features/menu'
import { useFocusTo, useFollowTarget, useMoveTo } from '@features/tracking-camera'
import { MAIN_MENU_POSITION } from '@pages/home'
import { FC, PropsWithChildren, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from '../../pages/home/model/status'
import { useGameStore } from '../../pages/home/model/store'
import { useUser } from '@entities/user'
import { useToggleReady } from '@features/menu/api/toggle-ready'

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
  const { t } = useTranslation()
  const appendLog = useAppendLog()
  const clearLogs = useClearLogs()
  const sendStopGame = useSendStopGame()
  const sendStartGame = useSendStartGame()
  const startTimer = useStartTimer()
  const sendKick = useSendKick()
  const { data: user } = useUser()
  const { data: session } = useSession()
  const { mutateAsync: toggleReady } = useToggleReady()

  const followTarget = useFollowTarget()
  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))
  const checkHost = useIsHost()

  const onDisconnectLobby = () => {
    sendKick(user?.id ?? '')
    console.log('send kick me')
    clearLogs()
  }

  const onKickPlayer = async (kickedID: string) => {
    sendKick(kickedID)
    invalidateSession()
    appendLog(t('kick_player_text')!)
  }

  const onDeleteLobby = () => {
    updatePlayerStatus(null)
    clearLogs()
  }

  const onPlay = async () => {
    sendStartGame()
    await followTarget(new Vector3(...playerStartPosition))
    startGame()
    startTimer()
    if (session?.players.find(({ id }) => user?.id === id)?.isReady) {
      toggleReady({ sessionID: session?.id ?? '', playerID: user?.id ?? '' })
    }
  }

  const onBackToLobby = async () => {
    resetTimer()
    toMainMenu()
    if (!finished) {
      sendStopGame()
    }
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
          onKickPlayer,
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
