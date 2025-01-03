import Scene from '@modules/app/scene/Scene'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scene />
  </StrictMode>
)
