import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}
