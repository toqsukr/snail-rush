import authService from '@shared/api/auth'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const getUserByTokenMutationKey = 'get-user-by-token'

export const useUserByToken = () => {
  return useMutation({
    mutationKey: [getUserByTokenMutationKey],
    mutationFn: async () => {
      return await authService.getPlayerByToken()
    },
  })
}

export const useIsGettingUserByToken = () => {
  return !!useIsMutating({ mutationKey: [getUserByTokenMutationKey] })
}
