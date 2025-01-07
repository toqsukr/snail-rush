import { MutationKeys } from '@modules/app/type.d'
import { usePlayerData } from '@modules/player/store'
import { GetPlayerResponse, UpdatePlayerResponseSchema } from '@modules/player/type.d'
import { useMutation } from '@tanstack/react-query'
import playerService from '../../service'

export const useUpdatePlayer = () => {
  const { setPlayerData } = usePlayerData()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.UPDATE_PLAYER],
    mutationFn: async (data: GetPlayerResponse) => {
      return playerService
        .updatePlayer(data.id, data)
        .then(({ data }) => UpdatePlayerResponseSchema.parse(data))
    },
    onSuccess: data => {
      setPlayerData(data)
    },
  })

  return { updatePlayer: mutateAsync, isPlayerUpdating: isPending }
}
