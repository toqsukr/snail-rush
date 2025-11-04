import { useWebSocket } from '@shared/lib/websocket'
import { Operations } from './types'
import { Vector3 } from 'three'

export const useSendShrink = () => {
  const websocket = useWebSocket()
  return (position: Vector3) => {
    const { x, y, z } = position

    websocket.send(
      JSON.stringify({
        type: Operations.PLAYER_SHRINK,
        data: { position: { x, y, z } },
      })
    )
  }
}
