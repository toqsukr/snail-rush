import { GameOver as Menu, lobbyMenuDepsContext, useLobbyMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'
import { useGameStore } from '../model/store'

const GAME_OVER_MENU_ROTATION = [0, 0, 0] satisfies [number, number, number]
const GAME_OVER_MENU_POSITION = [16.1, 35, -5] satisfies [number, number, number]

const GameOver = () => {
  const contextValue = useLobbyMenuDeps()
  const { started, finished, winner } = useGameStore()
  const positionRef = useRef(GAME_OVER_MENU_POSITION)
  const rotationRef = useRef(GAME_OVER_MENU_ROTATION)
  const camera = useThree(s => s.camera)

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
        <lobbyMenuDepsContext.Provider value={contextValue}>
          <Menu winnerName={winner.username} />
        </lobbyMenuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default GameOver
