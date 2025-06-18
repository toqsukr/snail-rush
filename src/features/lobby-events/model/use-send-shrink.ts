import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'

export const useSendShrink = () => {
  const websocket = useWebSocket()
  const { data: user } = useUser()
  return () => {
    if (!user) return

    websocket.send(
      JSON.stringify({
        type: Operations.PLAYER_SHRINK,
      })
    )
  }
}
