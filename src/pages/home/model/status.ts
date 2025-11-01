import { Vector3 } from 'three'

export const HOST_START_POSITION = new Vector3(19, 0.1, -10)

export const JOINED_START_POSITION = new Vector3(12.2, 0.1, -10)

export type PlayerStatus = 'host' | 'joined'

export enum PlayerPositions {
  FIRST,
  SECOND,
}

export enum PlayerSkins {
  HERBIVORE = 'herbivore',
  PREDATOR = 'predator',
}

export const getStartPosition = (playerPosition: PlayerPositions) => {
  const definePosition: Record<PlayerPositions, Vector3> = {
    0: HOST_START_POSITION,
    1: JOINED_START_POSITION,
  }
  return definePosition[playerPosition]
}

export const getTexturePath = (skin: string) => {
  const defineModelPath: Record<string, string> = {
    herbivore: '/textures/herbivore.png',
    predator: '/textures/predator.png',
  }
  return defineModelPath[skin]
}

export const getPlayerPosition = (status: PlayerStatus) => {
  const definePlayerPosition: Record<PlayerStatus, PlayerPositions> = {
    host: PlayerPositions.FIRST,
    joined: PlayerPositions.SECOND,
  }
  return definePlayerPosition[status]
}

export const getPlayerSkin = (status: PlayerStatus) => {
  const definePlayerPosition: Record<PlayerStatus, PlayerSkins> = {
    host: PlayerSkins.HERBIVORE,
    joined: PlayerSkins.PREDATOR,
  }
  return definePlayerPosition[status]
}
