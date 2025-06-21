import { useSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useKickPlayer } from '../api/kick-player'

export const useKickLobbyPlayer = () => {
  const kickPlayer = useKickPlayer()
  const { data: user } = useUser()
  const { data: session } = useSession()
  const updateSession = useSessionCode(s => s.updateSession)

  return async (dependentID: string) => {
    if (!session || !user) return
    await kickPlayer.mutateAsync({ sessionID: session.id, actorID: user.id, dependentID })
    const updatedSession = await sessionService.getSession(session.id)
    updateSession(updatedSession.session_id)
  }
}
