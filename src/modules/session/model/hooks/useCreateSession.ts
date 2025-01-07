import { MutationKeys } from '@modules/app/type.d'
import { CreateSessionResponseSchema } from '@modules/session/type.d'
import { useMutation } from '@tanstack/react-query'
import sessionService from '../../service'

export const useCreateSession = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.CREATE_SESSION],
    mutationFn: async (playerID: string) => {
      return sessionService
        .createSession(playerID)
        .then(({ data }) => CreateSessionResponseSchema.parse(data))
    },
  })

  return { createSession: mutateAsync, isSessionCreating: isPending }
}
