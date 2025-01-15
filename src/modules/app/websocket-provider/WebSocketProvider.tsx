import { OpponentPositionType, OpponentRotationType } from '@modules/gameplay/type.d'
import { createContext, FC, PropsWithChildren } from 'react'
import { useWebSocket } from './useWebSocket'

export type WebSocketContextType = {
  sendStartGame: (player_id: string) => void
  sendTargetPosition: (player_id: string, data: OpponentPositionType) => void
  sendTargetRotation: (player_id: string, data: OpponentRotationType) => void
}

export const webSocketContext = createContext<WebSocketContextType | undefined>(undefined)

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useWebSocket()

  return <webSocketContext.Provider value={value}>{children}</webSocketContext.Provider>
}

export default WebSocketProvider
