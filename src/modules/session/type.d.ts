import { GetPlayerResponseSchema } from '@modules/player/type.d'
import { z } from 'zod'

export const SessionSchema = z.object({
  session_id: z.string(),
  players: GetPlayerResponseSchema.array(),
  count_players: z.number(),
})

export const CreateSessionResponseSchema = SessionSchema

export const ConnectSessionResponseSchema = SessionSchema

export type SessionType = z.infer<typeof SessionSchema>

export type GetSessionResponse = z.infer<typeof SessionSchema>

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>

export type ConnectSessionResponse = z.infer<typeof CreateSessionResponseSchema>

export type SessionStore = {
  session: SessionType | null
  setSession: (session: SessionType) => void
}
