import { MainMenu as Menu, menuDepsContext, useMenuDeps, usePlay } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, useEffect, useRef } from 'react'
import { useGameStore } from '../model/store'

type MainMenuProp = {
  position: [number, number, number]
  rotation: [number, number, number]
}

const MainMenu: FC<MainMenuProp> = ({ position, rotation }) => {
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
      position={position}
      rotation={rotation}
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
