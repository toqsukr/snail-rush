import { WS_HOST_URL } from '@shared/api/base-template'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { createStrictContext, useStrictContext } from './react'

const webSocketContext = createStrictContext<WebSocket>()

type ProviderProps = {
  sessionID: string
  userID: string
  handler: (websocket: WebSocket, event: MessageEvent) => void
}

export const WebSocketProvider: FC<PropsWithChildren<ProviderProps>> = ({
  children,
  sessionID,
  userID,
  handler,
}) => {
  const [websocket] = useState(
    () =>
      new WebSocket(`${WS_HOST_URL}/api/v1/gameplay/session/${sessionID}/player/${userID}/start/`)
  )

  useEffect(() => {
    if (sessionID && userID) {
      websocket.onmessage = function (this: WebSocket, event: MessageEvent) {
        handler(this, event)
      }
      return () => websocket.close()
    }
  }, [sessionID, userID])

  return <webSocketContext.Provider value={websocket}>{children}</webSocketContext.Provider>
}

export const useWebSocket = () => useStrictContext(webSocketContext)
