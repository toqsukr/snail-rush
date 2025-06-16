import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const disconnectSessionMutationKey = 'disconnect-session'

export const useDisconnect = () => {
  return useMutation({
    mutationKey: [disconnectSessionMutationKey],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return await sessionService.kickPlayer(data.sessionID, data.playerID, data.playerID)
    },
  })
}

export const useIsDisconnectingSession = () => {
  return !!useIsMutating({ mutationKey: [disconnectSessionMutationKey] })
}
