import { z } from 'zod'

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
  UPDATE = 'session.update',
  DELETE = 'session.delete',
  CLOSE = 'session.close',
  CONNECT = 'player.connect',
  KICK = 'player.kick',
}

export const WebSocketResponseSchema = z.object({
  type: z.nativeEnum(Operations),
  data: z.unknown(),
})

export type WebSocketResponse = z.infer<typeof WebSocketResponseSchema>
