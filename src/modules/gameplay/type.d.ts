import { TransferPositionSchema, TransferRotationSchema } from '@modules/player/type.d'
import { z } from 'zod'

export const OpponentPositionSchema = z.object({
  position: TransferPositionSchema,
})

export const OpponentRotationSchema = z.object({
  rotation: TransferRotationSchema,
})

export type OpponentPositionType = z.infer<typeof OpponentPositionSchema>

export type OpponentRotationType = z.infer<typeof OpponentRotationSchema>

export type AppState = {
  moveable: boolean
  started: boolean
  countdown: boolean
  pause: boolean
  finished: boolean
  winnerID: string | null
  setWinner: (winnerID: string) => void
  setMoveable: (moveable: boolean) => void
  onPauseGame: () => void
  onCountDown: () => void
  onResumeGame: () => void
  onGameStart: () => void
  allowMoving: () => void
  onGameOver: () => void
}

export enum PlayerPositions {
  FIRST,
  SECOND,
}

export enum PlayerSkins {
  HERBIVORE = 'herbivore',
  PREDATOR = 'predator',
}
