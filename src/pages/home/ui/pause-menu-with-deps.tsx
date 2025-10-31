import { PauseMenu as Menu, lobbyMenuDepsContext, useLobbyMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Group } from 'three'
import { useGameStore } from '../model/store'

const PAUSE_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]

const PauseMenu = () => {
  const groupRef = useRef<Group>(null)
  const camera = useThree(s => s.camera)
  const { started, finished } = useGameStore()

  useEffect(() => {
    if (!groupRef.current) return
    camera.add(groupRef.current)
    return () => {
      if (groupRef.current) camera.remove(groupRef.current)
    }
  }, [camera])

  const contextValue = useLobbyMenuDeps()

  if (!started || finished) return null

  return (
    <group ref={groupRef}>
      <Html
        transform
        occlude='raycast'
        position={[0, 0, -10]}
        style={{ width: '100%' }}
        rotation={PAUSE_MENU_ROTATION}>
        <QueryClientProvider client={queryClient}>
          <lobbyMenuDepsContext.Provider value={contextValue}>
            <Menu />
          </lobbyMenuDepsContext.Provider>
        </QueryClientProvider>
      </Html>
    </group>
  )
}

export default PauseMenu
