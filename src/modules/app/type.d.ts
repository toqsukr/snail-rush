import { Socket } from 'socket.io-client'

export enum MutationKeys {
  CREATE_SESSION = 'create-session',
  CONNECT_SESSION = 'connect-session',
  CREATE_PLAYER = 'create-player',
}
export enum StorageKeys {
  PLAYER_DATA = 'player-data',
  SESSION_DATA = 'session-data',
}

export type APIStore = {
  socket: Socket | null
  setSocket: (socket: Socket) => void
}
