import { FC, PropsWithChildren, useEffect, useMemo } from 'react'
import { createStrictContext, useStrictContext } from './react'

const webSocketContext = createStrictContext<WebSocket>()

type ProviderProps = {
  url: string | URL
  handleMessage: (event: MessageEvent, closeConnection: () => void) => void
}

export const WebSocketProvider: FC<PropsWithChildren<ProviderProps>> = ({
  children,
  url,
  handleMessage,
}) => {
  const memoizedWebsocket = useMemo(() => new WebSocket(url), [url])

  useEffect(() => {
    return () => memoizedWebsocket.close()
  }, [memoizedWebsocket])

  useEffect(() => {
    memoizedWebsocket.onmessage = function (this: WebSocket, event: MessageEvent) {
      handleMessage(event, this.close)
    }
  }, [handleMessage])

  return <webSocketContext.Provider value={memoizedWebsocket}>{children}</webSocketContext.Provider>
}

export const useWebSocket = () => useStrictContext(webSocketContext)
