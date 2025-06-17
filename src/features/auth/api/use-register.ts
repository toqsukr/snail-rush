import authService from '@shared/api/auth'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const registerUserMutationKey = 'register-user'

export const useRegister = () => {
  return useMutation({
    mutationKey: [registerUserMutationKey],
    mutationFn: async (data: { username: string; password: string }) => {
      const registerData = await authService.register(data)
      return registerData
    },
  })
}

export const useIsRegistering = () => {
  return !!useIsMutating({ mutationKey: [registerUserMutationKey] })
}
