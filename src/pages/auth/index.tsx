import { AuthMenu as Menu, mainMenuDepsContext, useMainMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

const AUTH_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const AUTH_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

export const AuthPage = () => {
  const mainMenuContextValue = useMainMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={AUTH_MENU_POSITION}
      rotation={AUTH_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <Menu />
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}
