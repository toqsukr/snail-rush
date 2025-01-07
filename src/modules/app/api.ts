import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
})

export const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}
