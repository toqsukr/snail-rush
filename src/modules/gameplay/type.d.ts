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
  onPauseGame: () => void
  onCountDown: () => void
  onResumeGame: () => void
  onGameStart: () => void
  allowMoving: () => void
  onGameOver: () => void
  onWin: () => void
}
