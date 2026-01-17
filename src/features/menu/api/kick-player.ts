import { useMutation } from '@tanstack/react-query'
import sessionService from '@shared/api/session'

const kickPlayerMutationKey = 'kick-player'

type KickPlayer = {
  sessionID: string
  actorID: string
  dependentID: string
}

export const useKickPlayer = () => {
  return useMutation({
    mutationKey: [kickPlayerMutationKey],
    mutationFn: async (data: KickPlayer) => {
      const { sessionID, actorID, dependentID } = data
      return sessionService.kickPlayer(sessionID, actorID, dependentID)
    },
  })
}
