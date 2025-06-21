import playerService from '@shared/api/player'
import { useIsMutating, useMutation } from '@tanstack/react-query'

const sendFeedbackMutationKey = 'send-feedback'

export const useSendFeedback = () => {
  return useMutation({
    mutationKey: [sendFeedbackMutationKey],
    mutationFn: async (data: { playerID: string; message: string }) => {
      return playerService.sendFeedback(data.playerID, data.message)
    },
  })
}

export const useIsFeedbackSending = () => {
  return !!useIsMutating({ mutationKey: [sendFeedbackMutationKey] })
}
