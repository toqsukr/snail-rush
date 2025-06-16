import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'

export const useSendFinishGame = () => {
  const user = useUser(s => s.user)
  const websocket = useWebSocket()
  return () => {
    if (!user) return

    websocket.send(JSON.stringify({ type: Operations.PLAYER_FINISH, data: { player_id: user.id } }))
  }
}
