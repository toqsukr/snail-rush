import { TUser } from '@entities/user'
import playerService from '@shared/api/player'
import { useMutation } from '@tanstack/react-query'

const updateUserMutationKey = 'update-user'

export const useUpdatePlayer = () => {
  return useMutation({
    mutationKey: [updateUserMutationKey],
    mutationFn: async (data: Pick<TUser, 'id' | 'username' | 'skinID'>) => {
      const { id, skinID, ...rest } = data
      const playerDTO = { player_id: id, skin_id: skinID, ...rest }
      return playerService.updatePlayer(playerDTO)
    },
  })
}
