import { usePlayerData } from '@modules/player/store'
import { useSession } from '@modules/session/store'
import { SessionType } from '@modules/session/type.d'
import { useEffect, useRef } from 'react'
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
            case Operations.CONNECT:
              const connectData = responseData.data as SessionType
              setSession(connectData)
              break
            case Operations.KICK:
              console.log('player kicked')
              const kickData = responseData.data as SessionType
              setSession(kickData)
              break
            case Operations.CLOSE:
              websocket.current?.close()
              console.log('session closed')
              break
            case Operations.DELETE:
              websocket.current?.close()
              console.log('session deleted')
              break
            case Operations.UPDATE:
              console.log('session updated')
              const updatedData = responseData.data as SessionType
              setSession(updatedData)
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

  return (input: any) => {
    websocket.current?.send(JSON.stringify(input))
  }
}
