import { SkinMenu as Menu, mainMenuDepsContext, useMainMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { SKIN_MENU_POSITION, SKIN_MENU_ROTATION } from '../../../app/constants'

const SkinMenu = () => {
  const mainMenuContextValue = useMainMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={SKIN_MENU_POSITION}
      rotation={SKIN_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <Menu />
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default SkinMenu
