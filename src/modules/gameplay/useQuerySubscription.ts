import { WS_HOST_URL } from '@modules/app/constant'
import { useSession } from '@modules/session/store'
import { SessionSchema, SessionType } from '@modules/session/type.d'
import { useEffect, useRef } from 'react'
import { WebSocketRequestEvent } from './type.d'

export const useReactQuerySubscription = () => {
  const { session, setSession } = useSession()

  const websocket = useRef<WebSocket>()

  useEffect(() => {
    if (session?.session_id) {
      console.log('created')
      websocket.current = new WebSocket(
        `${WS_HOST_URL}/api/v1/gameplay/session/${session.session_id}/start/`
      )
      websocket.current.onmessage = event => {
        console.log('received event', event)
        try {
          const responseData = JSON.parse(event.data)
          SessionSchema.parse(responseData)
          const checkedData: SessionType = responseData
          setSession(checkedData)

          // switch (checkedData.operation) {
          //   case Operations.GET_POSITION:
          //     console.log(checkedData)
          //     break
          //   default:
          //     break
          // }
        } catch (e) {
          console.error(e)
        }
      }
      websocket.current.onopen = () => {
        console.log('connected')
      }

      return () => {
        websocket.current?.close()
      }
    }
  }, [session?.session_id])

  return (input: WebSocketRequestEvent) => {
    websocket.current?.send(JSON.stringify(input))
  }
}
