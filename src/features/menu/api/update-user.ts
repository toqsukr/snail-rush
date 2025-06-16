import { TPlayer } from '@entities/players'
import playerService from '@shared/api/player'
import { useMutation } from '@tanstack/react-query'

const updateUserMutationKey = 'update-user'

export const useUpdatePlayer = () => {
  return useMutation({
    mutationKey: [updateUserMutationKey],
    mutationFn: async (data: TPlayer) => {
      const { id, username, skinID } = data
      const playerDTO = { username, player_id: id, skin_id: skinID }
      return playerService.updatePlayer(playerDTO)
    },
  })
}
