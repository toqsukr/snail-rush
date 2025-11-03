export type TSession = {
  id: string
  players: { id: string; isReady: boolean }[]
  isActive: boolean
  hostID: string
  score: Record<string, number>
}
