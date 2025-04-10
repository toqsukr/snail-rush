import { PauseMenu as Menu, PauseButton, menuDepsContext, useMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useRef } from 'react'
import { MAIN_MENU_POSITION, MAIN_MENU_ROTATION } from '../model/constants'
import { useGameStore } from '../model/store'

const PauseMenu = () => {
  const positionRef = useRef(MAIN_MENU_POSITION)
  const rotationRef = useRef(MAIN_MENU_ROTATION)
  const camera = useThree(s => s.camera)
  const { started, finished } = useGameStore()

  useFrame(() => {
    const { x, y, z } = camera.position
    const { x: roll, y: pitch, z: yaw } = camera.rotation
    positionRef.current = [x, y / 2, z - 5]
    rotationRef.current = [roll, pitch, yaw]
  })

  const contextValue = useMenuDeps()

  if (!started || finished) return

  return (
    <Suspense fallback={null}>
      <Html
        transform
        occlude='raycast'
        position={positionRef.current}
        rotation={rotationRef.current}
        portal={{ current: document.body }}>
        <QueryClientProvider client={queryClient}>
          <menuDepsContext.Provider value={contextValue}>
            <Menu />
            <PauseButton />
          </menuDepsContext.Provider>
        </QueryClientProvider>
      </Html>
    </Suspense>
  )
}

export default PauseMenu
