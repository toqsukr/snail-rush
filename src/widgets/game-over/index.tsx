import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  GameOver as Menu,
  mainMenuDepsContext,
  lobbyMenuDepsContext,
  useLobbyMenuDeps,
  useMainMenuDeps,
} from '@features/menu'
import { useGameStore } from '@features/game'
import { queryClient } from '@shared/api/query-client'

const GAME_OVER_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const GAME_OVER_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

export const GameOver = () => {
  const contextValue = useLobbyMenuDeps()
  const { started, finished, winner } = useGameStore()
  const positionRef = useRef(GAME_OVER_MENU_POSITION)
  const rotationRef = useRef(GAME_OVER_MENU_ROTATION)
  const camera = useThree(s => s.camera)
  const mainMenuContextValue = useMainMenuDeps()

  useFrame(() => {
    const { x, y, z } = camera.position
    const { x: roll, y: pitch, z: yaw } = camera.rotation
    positionRef.current = [x, y / 2, z - 5]
    rotationRef.current = [roll, pitch, yaw]
  })

  if ((!started && finished) || !winner) return

  return (
    <Html
      transform
      occlude='raycast'
      position={positionRef.current}
      rotation={rotationRef.current}
      portal={{ current: document.body }}>
      <QueryClientProvider client={queryClient}>
        <mainMenuDepsContext.Provider value={mainMenuContextValue}>
          <lobbyMenuDepsContext.Provider value={contextValue}>
            <Menu winnerName={winner.username} />
          </lobbyMenuDepsContext.Provider>
        </mainMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}
