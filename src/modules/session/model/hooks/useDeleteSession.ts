import { MutationKeys } from '@modules/app/type.d'
import { useSession } from '@modules/session/store'
import { useMutation } from '@tanstack/react-query'
import sessionService from '../../service'

export const useDeleteSession = () => {
  const { setSession } = useSession()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [MutationKeys.DELETE_SESSION],
    mutationFn: async (sessionID: string) => {
      return sessionService.deleteSession(sessionID)
    },
    onSuccess: () => {
      setSession(null)
    },
  })

  return { deleteSession: mutateAsync, isSessionDeleting: isPending }
}
