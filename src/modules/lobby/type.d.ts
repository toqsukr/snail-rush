import { z } from 'zod'

export const LobbyCodeSchema = z.string().min(4).max(4)

export const LobbyFormCodeSchema = z.object({
  sessionID: LobbyCodeSchema,
})

export type LobbyCodeType = z.infer<typeof LobbyCodeSchema>

export type LobbyFormCodeType = z.infer<typeof LobbyFormCodeSchema>

export type LobbyStore = {
  status: PlayerStatus | null
  onCreateLobby: () => void
  onJoinLobby: () => void
  onClickBack: () => void
}

export type PlayerStatus = 'host' | 'joined'
