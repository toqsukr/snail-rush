import { z } from 'zod'

export const GetPlayerRequestSchema = z.object({
  player_id: z.string(),
})

export const CreatePlayerRequestSchema = z.object({
  username: z.string().min(1),
})

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
})

export const GetPlayerResponseSchema = z
  .object({
    position: PositionSchema.nullable(),
    position_history: PositionSchema.array(),
  })
  .merge(CreatePlayerRequestSchema.merge(GetPlayerRequestSchema))

export const PlayerDataSchema = GetPlayerResponseSchema

export const CreatePlayerResponseSchema = GetPlayerResponseSchema

export const UpdatePlayerRequestSchema = GetPlayerRequestSchema.merge(CreatePlayerRequestSchema)

export const UpdatePlayerResponseSchema = GetPlayerResponseSchema

export type GetPlayerRequest = z.infer<typeof GetPlayerRequestSchema>

export type GetPlayerResponse = z.infer<typeof GetPlayerResponseSchema>

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>

export type UpdatePlayerRequest = z.infer<typeof UpdatePlayerRequestSchema>

export type UpdatePlayerResponse = z.infer<typeof UpdatePlayerResponseSchema>

export type CreatePlayerResponse = z.infer<typeof CreatePlayerResponseSchema>

export type PlayerData = z.infer<typeof PlayerDataSchema>

export type PlayerDataStore = Partial<Omit<PlayerData, 'username'>> & {
  username: PlayerData['username']
  setUsername: (username: string) => void
  setPlayerData: (playerData: PlayerData) => void
}
