import { MutationKeys } from '@modules/app/type.d'
import { KickPlayerResponseSchema } from '@modules/session/type.d'
import { useMutation } from '@tanstack/react-query'
import sessionService from '../../service'

export const useKickPlayer = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.KICK_PLAYER],
    mutationFn: async (data: { sessionID: string; playerID: string }) => {
      return sessionService
        .kickPlayer(data.sessionID, data.playerID)
        .then(({ data }) => KickPlayerResponseSchema.parse(data))
    },
  })

  return { kickPlayer: mutateAsync, isPlayerKicking: isPending }
}
