import { usePlayers } from '@entities/players'
import { parseFromSessionDTO, useSession } from '@entities/session'
import { useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useKickPlayer } from '../api/kick-player'

export const useKickLobbyPlayer = () => {
  const kickPlayer = useKickPlayer()
  const { removePlayer } = usePlayers()
  const { data: user } = useUser()
  const { session, updateSession } = useSession()

  return async (dependentID: string) => {
    if (!session || !user) return

    removePlayer(dependentID)
    await kickPlayer.mutateAsync({ sessionID: session.id, actorID: user.id, dependentID })
    const updatedSession = await sessionService.getSession(session.id)
    updateSession(parseFromSessionDTO(updatedSession))
  }
}
