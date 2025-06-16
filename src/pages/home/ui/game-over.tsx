import { GameOver as Menu, lobbyMenuDepsContext, useLobbyMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'
import { MAIN_MENU_POSITION, MAIN_MENU_ROTATION } from '../model/constants'
import { useGameStore } from '../model/store'

const GameOver = () => {
  const contextValue = useLobbyMenuDeps()
  const { started, finished, winner } = useGameStore()
  const positionRef = useRef(MAIN_MENU_POSITION)
  const rotationRef = useRef(MAIN_MENU_ROTATION)
  const camera = useThree(s => s.camera)

  useFrame(() => {
    const { x, y, z } = camera.position
    const { x: roll, y: pitch, z: yaw } = camera.rotation
    positionRef.current = [x, y / 2, z - 5]
    rotationRef.current = [roll, pitch, yaw]
  })

  if ((!started && finished) || !winner) return

  console.log(positionRef.current, rotationRef.current)

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
