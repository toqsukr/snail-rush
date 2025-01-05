import { queryClient } from '@modules/app/api'
import Board from '@shared/Board'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  </StrictMode>
)
