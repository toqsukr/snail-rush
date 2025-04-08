export const HOST_START_POSITION = [19, 0.1, -10] satisfies [number, number, number]

export const JOINED_START_POSITION = [12.2, 0.1, -10] satisfies [number, number, number]

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
  const definePosition: Record<PlayerPositions, [number, number, number]> = {
    0: HOST_START_POSITION,
    1: JOINED_START_POSITION,
  }
  return definePosition[playerPosition]
}

export const getModelPath = (skin: PlayerSkins) => {
  const defineModelPath: Record<PlayerSkins, string> = {
    herbivore: '/animations/full-jump-static-light.glb',
    predator: '/animations/full-jump-static-opponent.glb',
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
