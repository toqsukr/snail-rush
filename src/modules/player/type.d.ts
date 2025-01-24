import { MessageSchema, PositionType } from '@modules/app/type.d'
import { Vector3 } from 'three'
import { z } from 'zod'

export const GetPlayerRequestSchema = z.object({
  player_id: z.string(),
})

export const CreatePlayerRequestSchema = z.object({
  username: z.string().min(1),
})

export const TransferPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  hold_time: z.number(),
  duration: z.number(),
})

export const TransferRotationSchema = z.object({
  roll: z.number(),
  pitch: z.number(),
  yaw: z.number(),
  duration: z.number(),
})

export const GetPlayerResponseSchema = CreatePlayerRequestSchema.merge(GetPlayerRequestSchema)

export const PlayerDataSchema = GetPlayerResponseSchema

export const CreatePlayerResponseSchema = GetPlayerResponseSchema

export const UpdatePlayerRequestSchema = GetPlayerRequestSchema.merge(CreatePlayerRequestSchema)

export const UpdatePlayerResponseSchema = GetPlayerResponseSchema

export const PlayerMoveMessageSchema = MessageSchema.merge(
  z.object({
    position: TransferPositionSchema,
  })
)

export const PlayerRotateMessageSchema = MessageSchema.merge(
  z.object({
    rotation: TransferRotationSchema,
  })
)

export type GetPlayerRequest = z.infer<typeof GetPlayerRequestSchema>

export type GetPlayerResponse = z.infer<typeof GetPlayerResponseSchema>

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>

export type UpdatePlayerRequest = z.infer<typeof UpdatePlayerRequestSchema>

export type UpdatePlayerResponse = z.infer<typeof UpdatePlayerResponseSchema>

export type CreatePlayerResponse = z.infer<typeof CreatePlayerResponseSchema>

export type PlayerData = z.infer<typeof PlayerDataSchema>

export type PlayerMoveMessageType = z.infer<typeof PlayerMoveMessageSchema>

export type PlayerRotateMessageType = z.infer<typeof PlayerRotateMessageSchema>

export type PlayerDataStore = Partial<Omit<PlayerData, 'username'>> & {
  username: PlayerData['username']
  initPosition: Vector3
  setInitPosition: (position: PositionType) => void
  setUsername: (username: string) => void
  setPlayerData: (playerData: PlayerData) => void
}
