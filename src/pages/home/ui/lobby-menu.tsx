import {
  lobbyMenuDepsContext,
  mainMenuDepsContext,
  LobbyMenu as Menu,
  PauseButton,
  useLobbyMenuDeps,
  useMainMenuDeps,
} from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'

const LOBBY_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const LOBBY_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

const LobbyMenu: FC = () => {
  const mainMenuContextValue = useMainMenuDeps()
  const lobbyContextValue = useLobbyMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={LOBBY_MENU_POSITION}
      rotation={LOBBY_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <lobbyMenuDepsContext.Provider value={lobbyContextValue}>
            <Menu />
            <PauseButton />
          </lobbyMenuDepsContext.Provider>
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default LobbyMenu
