import { TSkin } from '@entities/skin'
import { createStrictContext, useStrictContext } from '@shared/lib/react'

type MainMenuDeps = {
  onCreateLobby: (userID: string, sessionID: string) => void
  onConnectLobby: (userID: string, sessionID: string) => void
  onToSkins: () => void
  onBackToMainMenu: () => void
  onChangeSkin: (skin: TSkin) => void
  onRegister: (username: string, password: string) => void
  onLogin: (username: string, password: string) => void
  onSendFeedback: () => void
  onToFeedback: () => void
}

type LobbyMenuDeps = {
  onPlay: () => void
  onPause: () => void
  onContinue: () => void
  onKickPlayer: (kickedID: string) => void
  onDeleteLobby: () => void
  onDisconnectLobby: () => void
  isHost: (playerID: string) => boolean
  onBackToLobby: () => void
}

export const mainMenuDepsContext = createStrictContext<MainMenuDeps>()
export const lobbyMenuDepsContext = createStrictContext<LobbyMenuDeps>()

export const useMainMenuDeps = () => useStrictContext(mainMenuDepsContext)
export const useLobbyMenuDeps = () => useStrictContext(lobbyMenuDepsContext)
