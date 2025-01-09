import { usePlayerData } from '@modules/player/store'
import { useSession } from '@modules/session/store'
import { SessionType } from '@modules/session/type.d'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { WS_HOST_URL } from './constant'
import { Operations, WebSocketResponse, WebSocketResponseSchema } from './type.d'

export const useWebSocket = () => {
  const { session, setSession } = useSession()
  const { player_id } = usePlayerData()

  const websocket = useRef<WebSocket>()

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
              const connectData = responseData.data as SessionType
              setSession(connectData)
              break
            case Operations.PLAYER_KICK:
              console.log('player kicked')
              const kickData = responseData.data as SessionType
              setSession(kickData)
              break
            case Operations.PLAYER_MOVE:
              const moveData = responseData.data as SessionType
              console.log('player moved', moveData)
              // appendOpponentData()
              break
            case Operations.SESSION_CLOSE:
              websocket.current?.close()
              setSession(null)
              console.log('session closed')
              break
            case Operations.SESSION_DELETE:
              websocket.current?.close()
              setSession(null)
              console.log('session deleted')
              break
            case Operations.SESSION_UPDATE:
              console.log('session updated')
              const updatedData = responseData.data as SessionType
              setSession(updatedData)
              break
            case Operations.SESSION_UPDATE:
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

  const sendStartGame = () => {
    websocket.current?.send(JSON.stringify({ type: Operations.SESSION_START }))
  }

  const sendTargetPosition = (player_id: string, position: Vector3) => {
    const { x, y, z } = position
    websocket.current?.send(
      JSON.stringify({
        type: Operations.PLAYER_MOVE,
        data: { player_id, position: { x, y, z } },
      })
    )
  }

  return { sendStartGame, sendTargetPosition }
}
