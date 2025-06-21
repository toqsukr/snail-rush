// import { getPlayer, usePlayers } from '@entities/players'
// import { useSession } from '@entities/session'
// import { useUser } from '@entities/user'
// import { dateToUnixFloat } from '@shared/lib/time'
// import { useWebSocket } from '@shared/lib/websocket'
// import { Operations } from './types'

// export const useSendKick = () => {
//   const websocket = useWebSocket()
//   const { data: user } = useUser()
//   const { data: session } = useSession()

//   return () => {
//     if (!user || !session) return

//     const target = getPlayer() players.find(({ id }) => id !== user?.id)

//     if (!target) return

//     websocket.send(
//       JSON.stringify({
//         type: Operations.PLAYER_KICK,
//         data: {
//           actor_id: user.id,
//           kicked_id: user.id,
//           players,
//           session,
//           target_id: target.id,
//           timestamp: dateToUnixFloat(),
//         },
//       })
//     )
//   }
// }
