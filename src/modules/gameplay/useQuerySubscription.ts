import { useEffect, useRef } from 'react'
import {
  Operations,
  WebSocketRequestEvent,
  WebSocketResponseEvent,
  WebSocketResponseEventSchema,
} from './type'

export const useReactQuerySubscription = () => {
  const websocket = useRef<WebSocket>()

  useEffect(() => {
    websocket.current = new WebSocket('wss://echo.websocket.org/')
    websocket.current.onmessage = event => {
      console.log('received event', event)
      try {
        const responseData = JSON.parse(event.data)
        WebSocketResponseEventSchema.parse(responseData)
        const checkedData: WebSocketResponseEvent = responseData
        switch (checkedData.operation) {
          case Operations.GET_POSITION:
            console.log(checkedData)
            break
          default:
            break
        }
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
  }, [])

  return (input: WebSocketRequestEvent) => {
    websocket.current?.send(JSON.stringify(input))
  }
}
