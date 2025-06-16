import sessionService from '@shared/api/session'
import { useMutation } from '@tanstack/react-query'

const deleteSessionMutationKey = 'delete-session'

export const useDeleteSession = () => {
  return useMutation({
    mutationKey: [deleteSessionMutationKey],
    mutationFn: async (sessionID: string) => {
      return await sessionService.deleteSession(sessionID)
    },
  })
}
