import { GameOver as Menu, menuDepsContext, useMenuDeps } from '@features/menu'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, useRef } from 'react'
import { useGameStore } from '../model/store'

type MainMenuProp = {
  position: [number, number, number]
  rotation: [number, number, number]
}

const GameOver: FC<MainMenuProp> = ({ position, rotation }) => {
  const contextValue = useMenuDeps()
  const { started, finished, winner } = useGameStore()
  const positionRef = useRef(position)
  const rotationRef = useRef(rotation)
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
        <menuDepsContext.Provider value={contextValue}>
          <Menu winnerName={winner.username} />
        </menuDepsContext.Provider>
      </QueryClientProvider>
    </Html>
  )
}

export default GameOver
