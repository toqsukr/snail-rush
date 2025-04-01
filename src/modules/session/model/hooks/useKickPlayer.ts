import { MutationKeys } from '@modules/app/type.d'
import { useSession } from '@modules/session/store'
import { KickPlayerResponseSchema } from '@modules/session/type.d'
import { useMutation } from '@tanstack/react-query'
import sessionService from '../../service'

export const useKickPlayer = () => {
  const { onChangePlayers } = useSession()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.KICK_PLAYER],
    mutationFn: async (data: { sessionID: string; actorID: string; dependentID: string }) => {
      return sessionService
        .kickPlayer(data.sessionID, data.actorID, data.dependentID)
        .then(({ data }) => KickPlayerResponseSchema.parse(data))
    },
    onSuccess: ({ players }) => {
      onChangePlayers(players)
    },
  })

  return { kickPlayer: mutateAsync, isPlayerKicking: isPending }
}
