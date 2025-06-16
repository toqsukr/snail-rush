import {
  lobbyMenuDepsContext,
  mainMenuDepsContext,
  LobbyMenu as Menu,
  PauseButton,
  useLobbyMenuDeps,
  useMainMenuDeps,
  usePlay,
} from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, useEffect, useRef } from 'react'
import { MAIN_MENU_POSITION, MAIN_MENU_ROTATION } from '../../../app/constants'
import { useGameStore } from '../model/store'

const LobbyMenu: FC = () => {
  const mainMenuContextValue = useMainMenuDeps()
  const lobbyContextValue = useLobbyMenuDeps()
  const started = useGameStore(s => s.started)
  const prevStarted = useRef(started)
  const { playAction } = usePlay()

  useEffect(() => {
    if (started && !prevStarted.current) {
      playAction()
    }
    prevStarted.current = started
  }, [started])

  return (
    <Html
      transform
      occlude='raycast'
      position={MAIN_MENU_POSITION}
      rotation={MAIN_MENU_ROTATION}
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
