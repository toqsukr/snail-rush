import { Operations } from '@modules/app/type.d'
import { GetPlayerResponseSchema } from '@modules/player/type.d'
import { z } from 'zod'

export const SessionSchema = z.object({
  session_id: z.string(),
  players: GetPlayerResponseSchema.array(),
  count_players: z.number(),
})

export const CreateSessionResponseSchema = SessionSchema

export const ConnectSessionResponseSchema = SessionSchema

export const ConnectSessionWSSchema = z.object({
  type: z.literal(Operations.CONNECT),
  data: SessionSchema,
})

export const CloseSessionWSSchema = z.object({
  type: z.literal(Operations.CLOSE),
  data: SessionSchema,
})

export const DeleteSessionWSSchema = z.object({
  type: z.literal(Operations.DELETE),
  data: SessionSchema,
})

export const KickPlayerResponseSchema = CreateSessionResponseSchema

export type SessionType = z.infer<typeof SessionSchema>

export type GetSessionResponse = z.infer<typeof SessionSchema>

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>

export type ConnectSessionResponse = z.infer<typeof CreateSessionResponseSchema>

export type KickPlayerResponse = z.infer<typeof KickPlayerResponseSchema>

export type SessionStore = {
  session: SessionType | null
  setSession: (session: SessionType | null) => void
}
