import authService from '@shared/api/auth'
import { useMutation } from '@tanstack/react-query'

const loginMutationKey = 'account-login'

export const useRegister = () => {
  return useMutation({
    mutationKey: [loginMutationKey],
    mutationFn: async (data: { username: string; password: string }) => authService.login(data),
  })
}
