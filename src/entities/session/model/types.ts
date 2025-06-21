export type TSession = {
  id: string
  players: string[]
  isActive: boolean
  hostID: string
  score: Record<string, number>
}
