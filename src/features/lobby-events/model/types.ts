import { PlayerDTOSchema } from '@shared/api/player'
import { z } from 'zod'

export enum Operations {
  SESSION_START = 'session.start',
  SESSION_DELETE = 'session.delete',
  PLAYER_CONNECT = 'player.connect',
  PLAYER_MOVE = 'player.move',
  PLAYER_START_JUMP = 'player.jump',
  SESSION_STOP_GAME = 'session.stop',
  PLAYER_ROTATION = 'player.rotate',
  PLAYER_KICK = 'player.kick',
  PLAYER_FINISH = 'player.finish',
}

export const TransferPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  hold_time: z.number(),
  duration: z.number(),
})

export const TransferStartJumpSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
})

export const TransferRotationSchema = z.object({
  roll: z.number(),
  pitch: z.number(),
  yaw: z.number(),
  duration: z.number(),
})

export const OpponentPositionSchema = z.object({
  position: TransferPositionSchema,
})

export const OpponentStartJumpSchema = z.object({
  position: TransferStartJumpSchema,
})

export const OpponentRotationSchema = z.object({
  rotation: TransferRotationSchema,
})

export type OpponentPositionType = z.infer<typeof OpponentPositionSchema>

export type OpponentStartJumpType = z.infer<typeof OpponentStartJumpSchema>

export type OpponentRotationType = z.infer<typeof OpponentRotationSchema>

export const WebSocketResponseSchema = z.object({
  type: z.nativeEnum(Operations),
  data: z.unknown(),
})

export const MessageSchema = z.object({
  actor_id: z.string(),
})

export type WebSocketResponse = z.infer<typeof WebSocketResponseSchema>

export const PlayerMoveMessageSchema = MessageSchema.merge(
  z.object({
    position: TransferPositionSchema,
  })
)

export const PlayerStartJumpMessageSchema = MessageSchema.merge(OpponentStartJumpSchema)

export const PlayerRotateMessageSchema = MessageSchema.merge(
  z.object({
    rotation: TransferRotationSchema,
  })
)

export type PlayerMoveMessageType = z.infer<typeof PlayerMoveMessageSchema>

export type PlayerStartJumpMessageType = z.infer<typeof PlayerStartJumpMessageSchema>

export type PlayerRotateMessageType = z.infer<typeof PlayerRotateMessageSchema>

export type MessageType = z.infer<typeof MessageSchema>

export const ConnectPlayerMessageSchema = z
  .object({
    players: PlayerDTOSchema.array(),
  })
  .merge(MessageSchema)

export const KickPlayerMessageSchema = ConnectPlayerMessageSchema.merge(
  z.object({
    kicked_id: z.string(),
  })
)

export type ConnectPlayerMessageType = z.infer<typeof ConnectPlayerMessageSchema>

export type KickPlayerMessageType = z.infer<typeof KickPlayerMessageSchema>
