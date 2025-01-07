import { MutationKeys } from '@modules/app/type.d'
import { ConnectSessionResponseSchema } from '@modules/session/type.d'
import { useMutation } from '@tanstack/react-query'
import sessionService from '../../service'

export const useConnectSession = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: [MutationKeys.CONNECT_SESSION],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return sessionService
        .connectSession(data.sessionID, data.playerID)
        .then(({ data }) => ConnectSessionResponseSchema.parse(data))
    },
  })

  return { connectSession: mutate, isSessionConnecting: isPending }
}
