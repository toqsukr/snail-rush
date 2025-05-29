import { useSession } from '@entities/session'
import { parseFromPlayerDTO, useUser } from '@entities/user'
import { WS_HOST_URL } from '@shared/api/base-template'
import { useEffect, useRef } from 'react'
import { LobbyEventsProviderProp } from '../ui/lobby-events-provider'
import {
  ConnectPlayerMessageType,
  KickPlayerMessageType,
  MessageSchema,
  MessageType,
  Operations,
  OpponentPositionType,
  OpponentRotationType,
  PlayerMoveMessageSchema,
  PlayerMoveMessageType,
  PlayerRotateMessageSchema,
  PlayerRotateMessageType,
  PlayerStartJumpMessageSchema,
  PlayerStartJumpMessageType,
  WebSocketResponse,
  WebSocketResponseSchema,
} from './types'

export const useWebSocket = (props: LobbyEventsProviderProp) => {
  const websocket = useRef<WebSocket>()
  const { session, deleteSession } = useSession()
  const { user } = useUser()
  const {
    onKickMe,
    onGameStop,
    onGameStart,
    onGameFinish,
    onStartJump,
    onPlayerKicked,
    onPlayerConnected,
    onChangeOpponentPosition,
    onChangeOpponentRotation,
  } = props

  const onSessionExit = () => {
    onKickMe()
    websocket.current?.close()
    deleteSession()
  }

  useEffect(() => {
    if (session && user) {
      websocket.current = new WebSocket(
        `${WS_HOST_URL}/api/v1/gameplay/session/${session.id}/player/${user.id}/start/`
      )
      websocket.current.onmessage = event => {
        try {
          const responseData: WebSocketResponse = WebSocketResponseSchema.parse(
            JSON.parse(event.data)
          )

          switch (responseData.type) {
            case Operations.PLAYER_CONNECT:
              const connectData = responseData.data as ConnectPlayerMessageType
              onPlayerConnected(connectData.players.map(player => parseFromPlayerDTO(player)))
              break
            case Operations.PLAYER_KICK:
              const { kicked_id, players } = responseData.data as KickPlayerMessageType
              if (user.id === kicked_id) {
                onSessionExit()
              } else {
                onPlayerKicked(players.map(player => parseFromPlayerDTO(player)))
              }
              break
            case Operations.PLAYER_MOVE:
              const { position } = PlayerMoveMessageSchema.parse(
                responseData.data
              ) as PlayerMoveMessageType
              onChangeOpponentPosition({ position })
              console.log('player moved', position)
              break
            case Operations.PLAYER_ROTATION:
              const { rotation } = PlayerRotateMessageSchema.parse(
                responseData.data
              ) as PlayerRotateMessageType
              onChangeOpponentRotation({ rotation })
              console.log('player rotated', rotation)
              break
            case Operations.SESSION_STOP_GAME:
              onGameStop()
              console.log('game stop')
              break
            case Operations.PLAYER_START_JUMP:
              const startJumpData = PlayerStartJumpMessageSchema.parse(
                responseData.data
              ) as PlayerStartJumpMessageType
              onStartJump({ position: startJumpData.position })
              console.log('player start jump')
              break
            case Operations.SESSION_DELETE:
              onSessionExit()
              console.log('session deleted')
              break
            case Operations.SESSION_START:
              onGameStart()
              console.log('game started')
              break
            case Operations.PLAYER_FINISH:
              const finishData = MessageSchema.parse(responseData.data) as MessageType
              console.log(finishData)
              onGameFinish(finishData)
              console.log('game finished')
              break
            default:
              break
          }
        } catch (e) {
          console.error(e)
        }
      }
    } else {
      websocket.current?.close()
    }
    return () => {
      websocket.current?.close()
    }
  }, [
    session?.id,
    onSessionExit,
    onPlayerKicked,
    onPlayerConnected,
    onChangeOpponentPosition,
    onChangeOpponentRotation,
    onGameStart,
    onGameFinish,
    onGameStop,
    onKickMe,
  ])

  const sendStartGame = () => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({ type: Operations.SESSION_START, data: { player_id: user.id } })
    )
  }

  const sendFinishGame = () => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({ type: Operations.PLAYER_FINISH, data: { player_id: user.id } })
    )
  }

  const sendShrink = () => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_START_JUMP,
      })
    )
  }

  const sendStopGame = () => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({ type: Operations.SESSION_STOP_GAME, data: { player_id: user.id } })
    )
  }

  const sendTargetPosition = (data: OpponentPositionType) => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_MOVE,
        data: { player_id: user.id, ...data },
      })
    )
  }

  const sendTargetRotation = (data: OpponentRotationType) => {
    if (!user) return

    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_ROTATION,
        data: { player_id: user.id, ...data },
      })
    )
  }

  return {
    sendStartGame,
    sendFinishGame,
    sendTargetPosition,
    sendTargetRotation,
    sendShrink,
    sendStopGame,
  }
}
