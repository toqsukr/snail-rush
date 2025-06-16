import sessionService from '@shared/api/session'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const connectSessionMutationKey = 'connect-session'

export const useConnectSession = () => {
  return useMutation({
    mutationKey: [connectSessionMutationKey],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return await sessionService.connectSession(data.sessionID, data.playerID)
    },
  })
}

export const useIsConnectingSession = () => {
  return !!useIsMutating({ mutationKey: [connectSessionMutationKey] })
}
