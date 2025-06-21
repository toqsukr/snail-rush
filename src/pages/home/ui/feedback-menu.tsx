import { mainMenuDepsContext, FeedbackMenu as Menu, useMainMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

export const FEEDBACK_MENU_POSITION = [7, 35, 5] satisfies [number, number, number]
const FEEDBACK_MENU_ROTATION = [0, Math.PI / 2, 0] satisfies [number, number, number]

const FeedbackMenu = () => {
  const mainMenuContextValue = useMainMenuDeps()

  return (
    <Html
      transform
      occlude='raycast'
      position={FEEDBACK_MENU_POSITION}
      rotation={FEEDBACK_MENU_ROTATION}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <Menu />
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default FeedbackMenu
