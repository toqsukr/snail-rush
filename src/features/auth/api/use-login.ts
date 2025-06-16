import authService from '@shared/api/auth'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const loginUserMutationKey = 'login-user'

export const useLogin = () => {
  return useMutation({
    mutationKey: [loginUserMutationKey],
    mutationFn: async (data: { username: string; password: string }) => {
      return await authService.login(data)
    },
  })
}

export const useIsLogining = () => {
  return !!useIsMutating({ mutationKey: [loginUserMutationKey] })
}
