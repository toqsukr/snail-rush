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

export const PlayerDataSchema = GetPlayerResponseSchema

export const CreatePlayerResponseSchema = GetPlayerResponseSchema

export const UpdatePlayerRequestSchema = CreatePlayerRequestSchema

export type GetPlayerRequest = z.infer<typeof GetPlayerRequestSchema>

export type GetPlayerResponse = z.infer<typeof GetPlayerResponseSchema>

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>

export type UpdatePlayerRequest = z.infer<typeof UpdatePlayerRequestSchema>

export type DeletePlayerRequest = z.infer<typeof DeletePlayerRequestSchema>

export type CreatePlayerResponse = z.infer<typeof CreatePlayerResponseSchema>

export type PlayerData = z.infer<typeof PlayerDataSchema>

export type PlayerDataStore = Partial<Omit<PlayerData, 'username'>> & {
  username: PlayerData['username']
  setUsername: (username: string) => void
  setPlayerData: (playerData: PlayerData) => void
}
