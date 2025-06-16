import { usePlayers } from '@entities/players'
import { useSession } from '@entities/session'
import { TUser, useUser } from '@entities/user'
import { useStartTimer } from '@features/countdown'
import {
  MessageType,
  OpponentPositionType,
  OpponentRotationType,
  useEventsHandler,
} from '@features/lobby-events'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { useMenuMode } from '@features/menu'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { useFollowTarget } from '@features/tracking-camera'
import { getPlayerPosition, getStartPosition } from '@pages/home/lib/status'
import { FINISH_POSITION } from '@pages/home/model/constants'
import { useGameStore } from '@pages/home/model/store'
import { unixFloatToDate } from '@shared/lib/time'
import { WebSocketProvider } from '@shared/lib/websocket'
import { FC, PropsWithChildren, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { Vector3 } from 'three'

const WebSocketLayout: FC<PropsWithChildren> = ({ children }) => {
  const user = useUser(s => s.user)
  const session = useSession(s => s.session)
  const gameStore = useGameStore()
  const appendLog = useAppendLog()
  const clearLogs = useClearLogs()
  const { players, updatePlayers } = usePlayers()
  const followTarget = useFollowTarget()
  const startTimer = useStartTimer()
  const changeMenuMode = useMenuMode()

  const playerStartPosition = getStartPosition(getPlayerPosition(gameStore.playerStatus ?? 'host'))

  const onGameFinish = async ({ actor_id }: MessageType) => {
    gameStore.updateMoveable(false)
    await followTarget(FINISH_POSITION)
    gameStore.finishGame()
    const winner = players.find(({ id }) => id === actor_id)
    winner && gameStore.updateWinner(winner)
  }

  const onGameStart = async (startTimer: () => void) => {
    gameStore.startGame()
    await followTarget(new Vector3(...playerStartPosition))
    startTimer()
  }

  const onPlayerConnected = (updatedPlayers: TUser[], timestamp: number) => {
    const connected = updatedPlayers.find(({ id }) => players.every(player => id !== player.id))
    if (connected) {
      updatePlayers(updatedPlayers)
      const time = unixFloatToDate(timestamp)
      console.log(time.toISOString())
      appendLog(`Player ${connected.username} was connected!`, time)
    }
  }

  const onPlayerKicked = (updatedPlayers: TUser[], timestamp: number) => {
    const kicked = players.find(({ id }) => updatedPlayers.every(player => id !== player.id))
    if (kicked) {
      updatePlayers(updatedPlayers)
      const time = unixFloatToDate(timestamp)
      appendLog(`Player ${kicked.username} was kicked!`, time)
    }
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
    onGameStart: () => onGameStart(startTimer),
    onChangeOpponentRotation,
    onChangeOpponentPosition,
  }

  const handler = useEventsHandler(handlerProp)

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
