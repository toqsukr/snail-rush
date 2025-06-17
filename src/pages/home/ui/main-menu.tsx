import { MainMenu as Menu, mainMenuDepsContext, useMainMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

export const MAIN_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
export const MAIN_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

const MainMenu = () => {
  const mainMenuContextValue = useMainMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={MAIN_MENU_POSITION}
      rotation={MAIN_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <Menu />
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default MainMenu
