import { appendOpponentPosition } from '@modules/gameplay/model/append-opponent-position'
import { appendOpponentRotation } from '@modules/gameplay/model/append-opponent-rotation'
import { useAppState } from '@modules/gameplay/store'
import { OpponentPositionType, OpponentRotationType } from '@modules/gameplay/type'
import { usePlayerData } from '@modules/player/store'
import {
  PlayerMoveMessageSchema,
  PlayerMoveMessageType,
  PlayerRotateMessageSchema,
  PlayerRotateMessageType,
} from '@modules/player/type.d'
import { useSession } from '@modules/session/store'
import { ConnectPlayerMessageType, KickPlayerMessageType } from '@modules/session/type.d'
import { useEffect, useRef } from 'react'
import { WS_HOST_URL } from '../constant'
import { Operations, WebSocketResponse, WebSocketResponseSchema } from '../type.d'

export const useWebSocket = () => {
  const { session, setSession, onChangePlayers } = useSession()
  const { onGameStart } = useAppState()
  const { player_id } = usePlayerData()

  const websocket = useRef<WebSocket>()

  const onSessionExit = () => {
    websocket.current?.close()
    setSession(null)
  }

  useEffect(() => {
    if (session?.session_id) {
      websocket.current = new WebSocket(
        `${WS_HOST_URL}/api/v1/gameplay/session/${session.session_id}/player/${player_id}/start/`
      )
      websocket.current.onmessage = event => {
        try {
          const responseData: WebSocketResponse = WebSocketResponseSchema.parse(
            JSON.parse(event.data)
          )

          switch (responseData.type) {
            case Operations.PLAYER_CONNECT:
              const connectData = responseData.data as ConnectPlayerMessageType
              onChangePlayers(connectData.players)
              console.log('player connected')
              break
            case Operations.PLAYER_KICK:
              const { target_player_id, players } = responseData.data as KickPlayerMessageType
              if (player_id === target_player_id) {
                onSessionExit()
              } else {
                onChangePlayers(players)
              }
              console.log('player kicked')
              break
            case Operations.PLAYER_MOVE:
              const { position } = PlayerMoveMessageSchema.parse(
                responseData.data
              ) as PlayerMoveMessageType
              appendOpponentPosition({ position })
              console.log('player moved', position)
              break
            case Operations.PLAYER_ROTATION:
              const { rotation } = PlayerRotateMessageSchema.parse(
                responseData.data
              ) as PlayerRotateMessageType
              appendOpponentRotation({ rotation })
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
  }, [session?.session_id])

  const sendStartGame = (player_id: string) => {
    websocket.current?.send(JSON.stringify({ type: Operations.SESSION_START, data: { player_id } }))
  }

  const sendTargetPosition = (player_id: string, data: OpponentPositionType) => {
    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_MOVE,
        data: { player_id, ...data },
      })
    )
  }

  const sendTargetRotation = (player_id: string, data: OpponentRotationType) => {
    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_ROTATION,
        data: { player_id, ...data },
      })
    )
  }

  return { sendStartGame, sendTargetPosition, sendTargetRotation }
}
