import { FC } from 'react'
import { Html } from '@react-three/drei'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  lobbyMenuDepsContext,
  mainMenuDepsContext,
  LobbyMenu as Menu,
  PauseButton,
  useLobbyMenuDeps,
  useMainMenuDeps,
} from '@features/menu'
import { queryClient } from '@shared/api/query-client'

const LOBBY_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const LOBBY_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

export const LobbyMenu: FC = () => {
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
