import { useMutation } from '@tanstack/react-query'
import authService from '@shared/api/auth'

const registerMutationKey = 'account-register'

export const useRegister = () => {
  return useMutation({
    mutationKey: [registerMutationKey],
    mutationFn: async (data: { username: string; password: string }) => authService.register(data),
  })
}
