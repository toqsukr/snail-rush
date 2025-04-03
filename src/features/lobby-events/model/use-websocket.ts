import { useSession } from '@entities/session'
import { parseFromPlayerDTO, useUser } from '@entities/user'
import { WS_HOST_URL } from '@shared/api/base-template'
import { useEffect, useRef } from 'react'
import { LobbyEventsProviderProp } from '../ui/lobby-events-provider'
import {
  ConnectPlayerMessageType,
  KickPlayerMessageType,
  Operations,
  OpponentPositionType,
  OpponentRotationType,
  PlayerMoveMessageSchema,
  PlayerMoveMessageType,
  PlayerRotateMessageSchema,
  PlayerRotateMessageType,
  WebSocketResponse,
  WebSocketResponseSchema,
} from './types'

export const useWebSocket = (props: LobbyEventsProviderProp) => {
  const websocket = useRef<WebSocket>()
  const { session, deleteSession } = useSession()
  const { user } = useUser()
  const {
    onGameStart,
    onKickMe,
    onChangeLobbyPlayers,
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
              console.log('connected!', connectData)
              onChangeLobbyPlayers(connectData.players.map(player => parseFromPlayerDTO(player)))
              console.log('player connected')
              break
            case Operations.PLAYER_KICK:
              const { kicked_id, players } = responseData.data as KickPlayerMessageType
              console.log('kicked!', players)
              if (user.id === kicked_id) {
                onSessionExit()
              } else {
                onChangeLobbyPlayers(players.map(player => parseFromPlayerDTO(player)))
              }
              console.log('player kicked')
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
            case Operations.SESSION_DELETE:
              onSessionExit()
              console.log('session deleted')
              break
            case Operations.SESSION_START:
              onGameStart()
              console.log('game started')
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
  }, [session?.id])

  const sendStartGame = () => {
    if (!user) return

    console.log('start game', user.id)
    websocket.current?.send(
      JSON.stringify({ type: Operations.SESSION_START, data: { player_id: user.id } })
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

  return { sendStartGame, sendTargetPosition, sendTargetRotation }
}
