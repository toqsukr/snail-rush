import { parseFromPlayerDTO, TPlayer } from '@entities/players'
import { invalidateSession, resetSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import {
  ConnectPlayerMessageType,
  KickPlayerMessageType,
  MessageSchema,
  MessageType,
  Operations,
  OpponentPositionType,
  OpponentRotationType,
  OpponentStartJumpType,
  PlayerMoveMessageSchema,
  PlayerMoveMessageType,
  PlayerRotateMessageSchema,
  PlayerRotateMessageType,
  WebSocketResponse,
  WebSocketResponseSchema,
} from './types'

type LobbyEventsProviderProp = {
  onKickMe?: () => void
  onGameStart?: () => void
  onGameStop?: () => void
  onOpponentShrink?: () => void
  onStartJump?: (position: OpponentStartJumpType) => void
  onGameFinish?: (data: MessageType) => void
  onPlayerKicked?: (players: TPlayer[], timestamp: number) => void
  onPlayerConnected?: (players: TPlayer[], timestamp: number) => void
  onChangeOpponentPosition?: (position: OpponentPositionType) => void
  onChangeOpponentRotation?: (position: OpponentRotationType) => void
}

export const useEventsHandler = (props: LobbyEventsProviderProp) => {
  const deleteSession = useSessionCode(s => s.deleteSession)
  const { data: user } = useUser()

  const {
    onKickMe,
    onGameStop,
    onGameStart,
    onGameFinish,
    onOpponentShrink,
    onPlayerKicked,
    onPlayerConnected,
    onChangeOpponentPosition,
    onChangeOpponentRotation,
  } = props

  const handleMessage = (event: MessageEvent, closeConnection: () => void) => {
    const onSessionExit = () => {
      onKickMe?.()
      try {
        closeConnection()
      } catch (e) {
        console.error(e)
      }
      deleteSession()
      resetSession()
    }

    try {
      const responseData: WebSocketResponse = WebSocketResponseSchema.parse(JSON.parse(event.data))

      switch (responseData.type) {
        case Operations.PLAYER_CONNECT:
          invalidateSession()
          const connectData = responseData.data as ConnectPlayerMessageType
          console.log(responseData, connectData.players)
          onPlayerConnected?.(
            connectData.players.map(player => parseFromPlayerDTO(player)),
            connectData.timestamp
          )
          break
        case Operations.PLAYER_KICK:
          const { kicked_id, players, timestamp } = responseData.data as KickPlayerMessageType
          if (user?.id === kicked_id) {
            onSessionExit()
          } else {
            invalidateSession()
            onPlayerKicked?.(
              players.map(player => parseFromPlayerDTO(player)),
              timestamp
            )
          }
          break
        case Operations.PLAYER_MOVE:
          const { position } = PlayerMoveMessageSchema.parse(
            responseData.data
          ) as PlayerMoveMessageType
          onChangeOpponentPosition?.({ position })
          console.log('player moved', position)
          break
        case Operations.PLAYER_ROTATION:
          const { rotation } = PlayerRotateMessageSchema.parse(
            responseData.data
          ) as PlayerRotateMessageType
          onChangeOpponentRotation?.({ rotation })
          console.log('player rotated', rotation)
          break
        case Operations.SESSION_STOP_GAME:
          onGameStop?.()
          console.log('game stop')
          break
        case Operations.PLAYER_SHRINK:
          onOpponentShrink?.()
          // const startJumpData = PlayerStartJumpMessageSchema.parse(
          //   responseData.data
          // ) as PlayerStartJumpMessageType
          // onStartJump({ position: startJumpData.position })
          console.log('player shrink')
          break
        case Operations.SESSION_DELETE:
          onSessionExit()
          console.log('session deleted')
          break
        case Operations.SESSION_START:
          onGameStart?.()
          console.log('game started')
          break
        case Operations.PLAYER_FINISH:
          invalidateSession()
          const finishData = MessageSchema.parse(responseData.data) as MessageType
          console.log(finishData)
          onGameFinish?.(finishData)
          console.log('game finished')
          break
        default:
          break
      }
    } catch (e) {
      console.error(e)
    }
  }

  return handleMessage
}
