import { createStrictContext, useStrictContext } from '@shared/lib/react'

type MainMenuDeps = {
  onCreateLobby: (userID: string, sessionID: string) => void
  onConnectLobby: (userID: string, sessionID: string) => void
}

type LobbyMenuDeps = {
  onPlay: () => void
  onPause: () => void
  onContinue: () => void
  onDeleteLobby: () => void
  onBackToLobby: () => void
  onDisconnectLobby: () => void
  isHost: (playerID: string) => boolean
}

export const mainMenuDepsContext = createStrictContext<MainMenuDeps>()
export const lobbyMenuDepsContext = createStrictContext<LobbyMenuDeps>()

export const useMainMenuDeps = () => useStrictContext(mainMenuDepsContext)
export const useLobbyMenuDeps = () => useStrictContext(lobbyMenuDepsContext)
