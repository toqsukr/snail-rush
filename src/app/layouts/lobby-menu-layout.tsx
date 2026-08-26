import { Vector3 } from 'three'
import { useTranslation } from 'react-i18next'
import { FC, PropsWithChildren, Suspense } from 'react'

import { MAIN_MENU_POSITION } from '@pages/home'
import { lobbyMenuDepsContext } from '@features/menu'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { useToggleReady } from '@features/menu/api/toggle-ready'
import { useResetTimer, useStartTimer } from '@features/countdown'
import { useFocusTo, useFollowTarget, useMoveTo } from '@features/tracking-camera'
import { getPlayerPosition, getStartPosition, useGameStore } from '@features/game'
import { useSendKick, useSendStartGame, useSendStopGame } from '@features/lobby-events'
import { useUser } from '@entities/user'
import { useIsHost } from '@entities/session'
import { RACE_LEAD } from '@shared/config/game'
import { invalidateSession, useSession } from '@entities/session'

const LobbyMenuLayout: FC<PropsWithChildren> = ({ children }) => {
  const {
    resumeGame,
    pauseGame,
    toMainMenu,
    finished,
    startGame,
    markStart,
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

  const onPlay = () => {
    sendStartGame(RACE_LEAD / 1000)
    const startAt = Date.now() + RACE_LEAD
    markStart(startAt)
    startGame()
    startTimer(startAt)
    followTarget(new Vector3(...playerStartPosition))
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
