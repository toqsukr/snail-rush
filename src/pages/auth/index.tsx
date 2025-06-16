import { MAIN_MENU_POSITION, MAIN_MENU_ROTATION } from '@app/constants'
import { AuthMenu as Menu, mainMenuDepsContext, useMainMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

export const AuthPage = () => {
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
