import { GetPlayerResponseSchema } from '@modules/player/type'
import { z } from 'zod'

export const GetSessionResponseSchema = z.object({
  session_id: z.string(),
  players: GetPlayerResponseSchema.array(),
  count_players: z.number(),
})

export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>
