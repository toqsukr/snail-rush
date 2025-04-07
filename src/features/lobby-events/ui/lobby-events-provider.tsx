import { TUser } from '@entities/user'
import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren } from 'react'
import { MessageType, OpponentPositionType, OpponentRotationType } from '../model/types'
import { useWebSocket } from '../model/use-websocket'

export type LobbyEventsProviderProp = {
  onKickMe: () => void
  onGameStart: () => void
  onGameFinish: (data: MessageType) => void
  onChangeLobbyPlayers: (players: TUser[]) => void
  onChangeOpponentPosition: (position: OpponentPositionType) => void
  onChangeOpponentRotation: (position: OpponentRotationType) => void
}

type LobbyEventsContextType = {
  sendStartGame: () => void
  sendFinishGame: () => void
  sendTargetPosition: (data: OpponentPositionType) => void
  sendTargetRotation: (data: OpponentRotationType) => void
}

export const lobbyEventsContext = createStrictContext<LobbyEventsContextType>()

export const useLobbyEventsContext = () => useStrictContext(lobbyEventsContext)

export const LobbyEventsProvider: FC<PropsWithChildren<LobbyEventsProviderProp>> = ({
  children,
  ...props
}) => {
  const value = useWebSocket(props)

  return <lobbyEventsContext.Provider value={value}>{children}</lobbyEventsContext.Provider>
}
