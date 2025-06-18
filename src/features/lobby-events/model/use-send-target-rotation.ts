import { useUser } from '@entities/user'
import { useWebSocket } from '@shared/lib/websocket'
import { Operations, OpponentRotationType } from './types'

export const useSendTargetRotation = () => {
  const websocket = useWebSocket()
  const { data: user } = useUser()
  return (data: OpponentRotationType) => {
    if (!user) return

    websocket.send(
      JSON.stringify({
        type: Operations.PLAYER_ROTATION,
        data: { player_id: user.id, ...data },
      })
    )
  }
}
