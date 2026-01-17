import { useMutation } from '@tanstack/react-query'
import sessionService from '@shared/api/session'

const deleteSessionMutationKey = 'delete-session'

export const useDeleteSession = () => {
  return useMutation({
    mutationKey: [deleteSessionMutationKey],
    mutationFn: async (sessionID: string) => {
      return await sessionService.deleteSession(sessionID)
    },
  })
}
