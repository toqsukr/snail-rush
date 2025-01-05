import { z } from 'zod'

export const GetPlayerRequestSchema = z.object({
  playerID: z.string(),
})

export const CreatePlayerRequestSchema = z.object({
  username: z.string(),
})

export const GetPlayerResponseSchema = CreatePlayerRequestSchema.extend({
  id: z.string(),
})

export const UpdatePlayerRequestSchema = CreatePlayerRequestSchema

export type GetPlayerRequest = z.infer<typeof GetPlayerRequestSchema>

export type GetPlayerResponse = z.infer<typeof GetPlayerResponseSchema>

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>

export type UpdatePlayerRequest = z.infer<typeof UpdatePlayerRequestSchema>

export type DeletePlayerRequest = z.infer<typeof DeletePlayerRequestSchema>
