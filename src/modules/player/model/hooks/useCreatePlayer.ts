import { MutationKeys } from '@modules/app/type.d'
import { CreatePlayerRequest, CreatePlayerResponseSchema } from '@modules/player/type.d'
import { useCreateSession } from '@modules/session/model/hooks/useCreateSession'
import { useSession } from '@modules/session/store'
import { useMutation } from '@tanstack/react-query'
import playerService from '../../service'

export const useCreatePlayer = () => {
  const { createSession } = useCreateSession()
  const { setSession } = useSession()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.CREATE_PLAYER],
    mutationFn: async (data: CreatePlayerRequest) => {
      return playerService
        .createPlayer(data)
        .then(({ data }) => CreatePlayerResponseSchema.parse(data))
    },
  })

  return { createPlayer: mutateAsync, isPlayerCreating: isPending }
}
