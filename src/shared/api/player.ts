import { z } from 'zod'
import baseTemplate from './base-template'

export const PlayerDTOSchema = z.object({
  player_id: z.string(),
  username: z.string().min(1),
  wins: z.number(),
  losses: z.number(),
  total_games: z.number(),
  skin_id: z.string(),
  is_ready: z.boolean(),
})

export type PlayerDTO = z.infer<typeof PlayerDTOSchema>

class PlayerService {
  readonly PLAYER_PREFIX = '/player'

  async getPlayer(player_id: string) {
    return baseTemplate
      .get(`${this.PLAYER_PREFIX}/${player_id}/`)
      .then(({ data }) => PlayerDTOSchema.parse(data))
  }

  async createPlayer(username: string) {
    return baseTemplate
      .post(this.PLAYER_PREFIX, { username })
      .then(({ data }) => PlayerDTOSchema.parse(data))
  }

  async updatePlayer(user: Pick<PlayerDTO, 'player_id' | 'username' | 'skin_id'>) {
    const { player_id, ...rest } = user
    return baseTemplate
      .put(`${this.PLAYER_PREFIX}/${player_id}/`, rest)
      .then(({ data }) => PlayerDTOSchema.parse(data))
  }

  async deletePlayer(player_id: string) {
    return baseTemplate.post<null>(`${this.PLAYER_PREFIX}/${player_id}/`, null)
  }

  async sendFeedback(player_id: string, message: string) {
    return baseTemplate.post(`${this.PLAYER_PREFIX}/${player_id}/feedback/`, { message })
  }
}

export default new PlayerService()
