import { getPlayer, TPlayer } from '@entities/players'
import { invalidateSession, useSession } from '@entities/session'
import { useUser } from '@entities/user'
import { useStartTimer } from '@features/countdown'
import {
  MessageType,
  OpponentPositionType,
  OpponentRotationType,
  useEventsHandler,
} from '@features/lobby-events'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { useMenuMode } from '@features/menu'
import { useKickLobbyPlayer } from '@features/menu/model/use-kick-player'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { useFollowTarget } from '@features/tracking-camera'
import { FINISH_POSITION } from '@pages/home'
import { getPlayerPosition, getStartPosition } from '@pages/home/lib/status'
import { useGameStore } from '@pages/home/model/store'
import { unixFloatToDate } from '@shared/lib/time'
import { WebSocketProvider } from '@shared/lib/websocket'
import { FC, PropsWithChildren, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Vector3 } from 'three'

const WebSocketLayout: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: session } = useSession()
  const gameStore = useGameStore()
  const appendLog = useAppendLog()
  const clearLogs = useClearLogs()
  const followTarget = useFollowTarget()
  const startTimer = useStartTimer()
  const changeMenuMode = useMenuMode()
  const kickLobbyPlayer = useKickLobbyPlayer()

  const playerStartPosition = getStartPosition(getPlayerPosition(gameStore.playerStatus ?? 'host'))

  const onGameFinish = async ({ actor_id }: MessageType) => {
    gameStore.updateMoveable(false)
    await followTarget(FINISH_POSITION)
    gameStore.finishGame()

    const winner = await getPlayer(actor_id)

    winner && gameStore.updateWinner(winner)
  }

  const onGameStart = async (startTimer: () => void) => {
    gameStore.startGame()
    await followTarget(new Vector3(...playerStartPosition))
    startTimer()
  }

  const onPlayerConnected = (updatedPlayers: TPlayer[], timestamp: number) => {
    const connected = updatedPlayers.find(({ id }) => id !== user?.id)
    if (connected) {
      const time = unixFloatToDate(timestamp)
      appendLog(`${connected.username} ${t('connected_lobby_text')}`, time)
    }
  }

  const onPlayerKicked = () => {
    // const kicked = players.find(({ id }) => updatedPlayers.every(player => id !== player.id))
    // if (kicked) {
    //   updatePlayers(updatedPlayers)
    //   const time = unixFloatToDate(timestamp)
    //   appendLog(`${kicked.username} ${t('kick_player_text')}!`, time)
    // }
  }

  const onGameStop = async () => {
    // resetTimer()
    // toMainMenu()
    // await moveTo([
    //   MAIN_MENU_POSITION[0],
    //   MAIN_MENU_POSITION[1],
    //   MAIN_MENU_POSITION[2] + 10,
    // ])
    // const tempStatus = playerStatus
    // updatePlayerStatus(null)
    // await focusTo(new Vector3(...MAIN_MENU_POSITION))
    // updatePlayerStatus(tempStatus)
  }

  const onStartJump = () => {}

  const onKickMe = () => {
    gameStore.updatePlayerStatus(null)
    changeMenuMode('main-menu')
    clearLogs()
  }

  const onChangeOpponentRotation = ({ rotation }: OpponentRotationType) => {
    pushOpponentRotation(rotation)
  }
  const onChangeOpponentPosition = ({ position: { hold_time, ...rest } }: OpponentPositionType) => {
    pushOpponentPosition({ ...rest, holdTime: hold_time })
  }

  const handlerProp = {
    onKickMe,
    onGameStop,
    onStartJump,
    onGameFinish,
    onPlayerKicked,
    onPlayerConnected,
    onOpponentShrink: async () => {
      const kickID = session?.players.find(id => id !== user?.id)
      if (kickID) {
        await kickLobbyPlayer(kickID)
        invalidateSession()
      }
    },
    onGameStart: () => onGameStart(startTimer),
    onChangeOpponentRotation,
    onChangeOpponentPosition,
  }

  const handler = useEventsHandler(handlerProp)

  if (isUserLoading) return

  if (!user?.id || !session?.id) return <Navigate to={'..'} />

  const webSocketValue = {
    userID: user.id,
    sessionID: session.id,
    handler,
  }

  return (
    <Suspense>
      <WebSocketProvider {...webSocketValue}>{children}</WebSocketProvider>
    </Suspense>
  )
}

export default WebSocketLayout
