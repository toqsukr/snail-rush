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
import { WS_HOST_URL } from '@shared/api/base-template'
import { unixFloatToDate } from '@shared/lib/time'
import { WebSocketProvider } from '@shared/lib/websocket'
import { FC, PropsWithChildren, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Euler, Vector3 } from 'three'

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
    gameStore.finishGame()

    setTimeout(async () => {
      await followTarget(FINISH_POSITION)
      const winner = await getPlayer(actor_id)

      if (winner) {
        gameStore.updateWinner(winner)
      }
    })
  }

  const onGameStart = async () => {
    await followTarget(new Vector3(...playerStartPosition))
    startTimer()
    gameStore.startGame()
  }

  const onPlayerConnected = (updatedPlayers: TPlayer[], timestamp: number) => {
    const connected = updatedPlayers.find(({ id }) => id !== user?.id)
    if (connected) {
      const time = unixFloatToDate(timestamp)
      appendLog(`${connected.username} ${t('connected_lobby_text')}`, time)
    }
  }

  const onKickMe = () => {
    gameStore.updatePlayerStatus(null)
    changeMenuMode('main-menu')
    clearLogs()
  }

  const onChangeOpponentRotation = ({ rotation }: OpponentRotationType) => {
    const { duration, roll, pitch, yaw } = rotation
    pushOpponentRotation({ rotation: new Euler(roll, pitch, yaw), duration })
  }
  const onChangeOpponentPosition = ({ position }: OpponentPositionType) => {
    const { duration, hold_time, x, y, z } = position
    pushOpponentPosition({ impulse: new Vector3(x, y, z), duration, holdTime: hold_time })
  }

  const onOpponentShrink = async () => {
    const kickID = session?.players.find(id => id !== user?.id)
    if (kickID) {
      await kickLobbyPlayer(kickID)
      invalidateSession()
    }
  }

  const handlerProp = {
    onKickMe,
    onGameFinish,
    onPlayerConnected,
    onOpponentShrink,
    onGameStart,
    onChangeOpponentRotation,
    onChangeOpponentPosition,
  }

  const handleMessage = useEventsHandler(handlerProp)

  if (isUserLoading) return

  if (!user?.id || !session?.id) return <Navigate to={'..'} />

  const webSocketValue = {
    url: `${WS_HOST_URL}/api/v1/gameplay/session/${session.id}/player/${user.id}/start/`,
    handleMessage,
  }

  return (
    <Suspense>
      <WebSocketProvider {...webSocketValue}>{children}</WebSocketProvider>
    </Suspense>
  )
}

export default WebSocketLayout
