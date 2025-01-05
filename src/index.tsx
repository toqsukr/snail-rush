import { queryClient } from '@modules/app/api'
import Scene from '@modules/app/scene/Scene'
import { Canvas } from '@react-three/fiber'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Canvas>
        <Scene />
      </Canvas>
    </QueryClientProvider>
  </StrictMode>
)
