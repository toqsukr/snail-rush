import { useRef } from 'react'
import { Group, Object3DEventMap, Vector3 } from 'three'
import { QueryClientProvider } from '@tanstack/react-query'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameStore } from '@features/game'
import { PauseMenu as Menu, lobbyMenuDepsContext, useLobbyMenuDeps } from '@features/menu'
import { queryClient } from '@shared/api/query-client'

const PAUSE_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const DISTANCE = 10

export const PauseMenu = () => {
  const groupRef = useRef<Group<Object3DEventMap>>(null)
  const camera = useThree(s => s.camera)
  const { started, finished } = useGameStore()

  useFrame(() => {
    if (!groupRef.current) return

    const direction = new Vector3()
    camera.getWorldDirection(direction)

    groupRef.current.position.copy(camera.position).add(direction.multiplyScalar(DISTANCE))
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  const contextValue = useLobbyMenuDeps()

  if (!started || finished) return null

  return (
    <group ref={groupRef}>
      <Html
        transform
        occlude='raycast'
        position={[0, 0, 0]}
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
