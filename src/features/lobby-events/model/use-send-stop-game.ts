import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'

export const useSendStopGame = () => {
  const websocket = useWebSocket()
  const { data: user } = useUser()
  return () => {
    if (!user) return

    websocket.send(
      JSON.stringify({ type: Operations.SESSION_STOP_GAME, data: { player_id: user.id } })
    )
  }
}
