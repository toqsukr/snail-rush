import { PauseMenu as Menu, lobbyMenuDepsContext, useLobbyMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useRef } from 'react'
import { useGameStore } from '../model/store'

const PAUSE_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const PAUSE_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

const PauseMenu = () => {
  const positionRef = useRef(PAUSE_MENU_POSITION)
  const rotationRef = useRef(PAUSE_MENU_ROTATION)
  const camera = useThree(s => s.camera)
  const { started, finished } = useGameStore()

  useFrame(() => {
    const { x, y, z } = camera.position
    const { x: roll, y: pitch, z: yaw } = camera.rotation
    positionRef.current = [x, y / 2, z - 5]
    rotationRef.current = [roll, pitch, yaw]
  })

  const contextValue = useLobbyMenuDeps()

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
          <lobbyMenuDepsContext.Provider value={contextValue}>
            <Menu />
          </lobbyMenuDepsContext.Provider>
        </QueryClientProvider>
      </Html>
    </Suspense>
  )
}

export default PauseMenu
