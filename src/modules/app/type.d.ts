import { z } from 'zod'

export type PositionType = [number, number, number]

export type RotationType = [number, number, number]

export enum MutationKeys {
  CREATE_SESSION = 'create-session',
  DELETE_SESSION = 'delete-session',
  CONNECT_SESSION = 'connect-session',
  CREATE_PLAYER = 'create-player',
  UPDATE_PLAYER = 'update-player',
  KICK_PLAYER = 'kick-player',
}

export enum StorageKeys {
  PLAYER_DATA = 'player-data',
  SESSION_DATA = 'session-data',
}

export enum Operations {
  SESSION_START = 'session.start',
  SESSION_DELETE = 'session.delete',
  PLAYER_CONNECT = 'player.connect',
  PLAYER_MOVE = 'player.move',
  PLAYER_ROTATION = 'player.rotate',
  PLAYER_KICK = 'player.kick',
}

export const WebSocketResponseSchema = z.object({
  type: z.nativeEnum(Operations),
  data: z.unknown(),
})

export const MessageSchema = z.object({
  actor_id: z.string(),
})

export type WebSocketResponse = z.infer<typeof WebSocketResponseSchema>
