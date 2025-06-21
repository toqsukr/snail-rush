import { TSession } from '@entities/session'
import { SessionDTO } from '@shared/api/session'

export const parseFromSessionDTO = (sessionDTO: SessionDTO) => {
  const { host_id, is_active, players, session_id, ...rest } = sessionDTO

  const session: TSession = {
    id: session_id,
    players: players.map(player => player.player_id),
    isActive: is_active,
    hostID: host_id,
    ...rest,
  }

  return session
}
