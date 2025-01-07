import { MutationKeys } from '@modules/app/type.d'
import { CreatePlayerRequest, CreatePlayerResponseSchema } from '@modules/player/type.d'
import { useMutation } from '@tanstack/react-query'
import playerService from '../../service'

export const useCreatePlayer = () => {
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
