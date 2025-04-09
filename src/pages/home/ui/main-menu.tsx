import { MainMenu as Menu, menuDepsContext, useMenuDeps, usePlay } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { MAIN_MENU_POSITION, MAIN_MENU_ROTATION } from '../model/constants'
import { useGameStore } from '../model/store'

const MainMenu = () => {
  const contextValue = useMenuDeps()
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
        <menuDepsContext.Provider value={contextValue}>
          <Menu />
        </menuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default MainMenu
