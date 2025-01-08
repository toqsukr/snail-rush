// export const PositionSchema = z.object({
//   x: z.number(),
//   y: z.number(),
//   z: z.number(),
// })

// export const GetPositionRequestSchema = z.object({
//   operation: z.literal(Operations.GET_POSITION),
//   id: z.number(),
// })

// export const UpdatePositionRequestSchema = z.object({
//   operation: z.literal(Operations.UPDATE_POSITION),
//   id: z.number(),
//   position: PositionSchema,
// })

// export const GetPositionResponseSchema = UpdatePositionRequestSchema.omit({
//   operation: true,
// }).extend({
//   operation: z.literal(Operations.GET_POSITION),
// })

// export type GetPositionRequest = z.infer<typeof GetPositionRequestSchema>

// export type UpdatePositionRequest = z.infer<typeof UpdatePositionRequestSchema>

// export type GetPositionResponse = z.infer<typeof GetPositionResponseSchema>

export type AppState = {
  started: boolean
  onGameStart: () => void
  onGameOver: () => void
  onWin: () => void
}

export type PositionType = [number, number, number]

export type AnimationPositionData = { start: PositionType; end: PositionType }

export type OpponentState = {
  positionQueue: AnimationPositionData[]
  addPosition: (position: AnimationPositionData) => void
  popPosition: () => void
}
