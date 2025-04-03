import { createStrictContext, useStrictContext } from '@shared/lib/react'

type MenuDeps = {
  onPlay: () => void
  onPause: () => void
  onContinue: () => void
  onCreateLobby: () => void
  onConnectLobby: () => void
  onDeleteLobby: () => void
  onDisconnectLobby: () => void
  isHost: (playerID: string) => boolean
}

export const menuDepsContext = createStrictContext<MenuDeps>()

export const useMenuDeps = () => useStrictContext(menuDepsContext)
