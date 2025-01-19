import { MessageSchema, Operations } from '@modules/app/type.d'
import { GetPlayerResponseSchema, PlayerData } from '@modules/player/type.d'
import { z } from 'zod'

export const SessionSchema = z.object({
  session_id: z.string(),
  players: GetPlayerResponseSchema.array(),
})

export const ConnectPlayerMessageSchema = SessionSchema.omit({ session_id: true }).merge(
  MessageSchema
)

export const CreateSessionResponseSchema = SessionSchema

export const ConnectPlayerResponseSchema = SessionSchema

export const ConnectSessionWSSchema = z.object({
  type: z.literal(Operations.CONNECT),
  data: ConnectPlayerMessageSchema,
})

export const CloseSessionWSSchema = z.object({
  type: z.literal(Operations.CLOSE),
  data: ConnectPlayerMessageSchema,
})

export const DeleteSessionWSSchema = z.object({
  type: z.literal(Operations.DELETE),
  data: ConnectPlayerMessageSchema,
})

export const KickPlayerResponseSchema = CreateSessionResponseSchema

export const KickPlayerMessageSchema = ConnectPlayerMessageSchema.merge(
  z.object({
    target_player_id: z.string(),
  })
)

export type SessionType = z.infer<typeof SessionSchema>

export type ConnectPlayerMessageType = z.infer<typeof ConnectPlayerMessageSchema>

export type KickPlayerMessageType = z.infer<typeof KickPlayerMessageSchema>

export type GetSessionResponse = z.infer<typeof SessionSchema>

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>

export type ConnectPlayerResponse = z.infer<typeof ConnectPlayerResponseSchema>

export type KickPlayerResponse = z.infer<typeof KickPlayerResponseSchema>

export type SessionStore = {
  session: SessionType | null
  setSession: (session: SessionType | null) => void
  onChangePlayers: (players: PlayerData[]) => void
}
