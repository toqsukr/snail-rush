import { parseFromSessionDTO, useSession } from '@entities/session'
import { useUser } from '@entities/user'
import sessionService from '@shared/api/session'
import { useMutation } from '@tanstack/react-query'
import { KickPlayer } from './types'

const kickPlayerMutationKey = 'kick-player'

const useKickPlayer = () => {
  return useMutation({
    mutationKey: [kickPlayerMutationKey],
    mutationFn: async (data: KickPlayer) => {
      const { sessionID, actorID, dependentID } = data
      return await sessionService.kickPlayer(sessionID, actorID, dependentID)
    },
  })
}

export const useKickLobbyPlayer = () => {
  const kickPlayer = useKickPlayer()
  const user = useUser(s => s.user)
  const { session, updateSession } = useSession()

  return async (dependentID: string) => {
    if (!session || !user) return

    await kickPlayer.mutateAsync({ sessionID: session.id, actorID: user.id, dependentID })
    const updatedSession = await sessionService.getSession(session.id)
    updateSession(parseFromSessionDTO(updatedSession))
  }
}
