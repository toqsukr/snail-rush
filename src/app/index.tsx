import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '@shared/lib/error-boundary'
import './index.scss'
import { router } from './router'
import ErrorScreen from './ui/error-screen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorScreen />}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
)
