import { QueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { WS_HOST_URL } from './constant'

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

export const createSocket = (sessionID: string) => {
  return io(`${WS_HOST_URL}/gameplay/session/${sessionID}/start`)
}
