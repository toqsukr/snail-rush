import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'

export const useSendStartGame = () => {
  const websocket = useWebSocket()
  const user = useUser(s => s.user)
  return () => {
    if (!user) return

    websocket.send(JSON.stringify({ type: Operations.SESSION_START, data: { player_id: user.id } }))
  }
}
