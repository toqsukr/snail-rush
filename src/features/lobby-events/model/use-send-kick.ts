import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'

export const useSendKick = () => {
  const websocket = useWebSocket()
  const { data: user } = useUser()

  return (userID: string) => {
    if (!user) return

    websocket.send(
      JSON.stringify({
        type: Operations.PLAYER_KICK,
        data: { kicked_id: userID },
      })
    )
  }
}
