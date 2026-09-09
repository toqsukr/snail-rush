import { Html } from '@react-three/drei'
import { QueryClientProvider } from '@tanstack/react-query'
import { ControlsMenu as Menu, mainMenuDepsContext, useMainMenuDeps } from '@features/menu'
import { queryClient } from '@shared/api/query-client'

export const CONTROLS_MENU_POSITION = [25.2, 35, 5] satisfies [number, number, number]
const CONTROLS_MENU_ROTATION = [0, -Math.PI / 2, 0] satisfies [number, number, number]

const ControlsMenu = () => {
  const mainMenuContextValue = useMainMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={CONTROLS_MENU_POSITION}
      rotation={CONTROLS_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <Menu />
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default ControlsMenu
