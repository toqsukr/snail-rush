import { createContext, FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { useWebSocket } from '../useWebSocket'

export type WebSocketContextType = {
  sendStartGame: () => void
  sendTargetPosition: (player_id: string, positionArray: Vector3) => void
}

export const webSocketContext = createContext<WebSocketContextType | undefined>(undefined)

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { sendStartGame, sendTargetPosition } = useWebSocket()

  return (
    <webSocketContext.Provider value={{ sendStartGame, sendTargetPosition }}>
      {children}
    </webSocketContext.Provider>
  )
}

export default WebSocketProvider
