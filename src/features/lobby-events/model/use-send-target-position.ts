import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations, OpponentPositionType } from './types'

export const useSendTargetPosition = () => {
  const websocket = useWebSocket()
  const { data: user } = useUser()
  return (data: OpponentPositionType) => {
    if (!user) return

    websocket.send(
      JSON.stringify({
        type: Operations.PLAYER_MOVE,
        data: { player_id: user.id, ...data },
      })
    )
  }
}
