import { useMutation } from '@tanstack/react-query'
import { invalidateSession } from '@entities/session'
import sessionService from '@shared/api/session'

const toggleReadyMutationKey = 'toggle-player-ready'

export const useToggleReady = () => {
  return useMutation({
    mutationKey: [toggleReadyMutationKey],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      const { playerID, sessionID } = data
      return sessionService.toggleReady(sessionID, playerID)
    },
    onSuccess: () => {
      invalidateSession()
    },
  })
}
