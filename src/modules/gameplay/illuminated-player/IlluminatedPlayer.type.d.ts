import { PlayerProp } from '../player/Player.type'

export type IlluminatedPlayerProp = Omit<PlayerProp, 'playerID'>
