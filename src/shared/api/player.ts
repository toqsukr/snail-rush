import { z } from 'zod'
import baseTemplate from './base-template'

export const PlayerDTOSchema = z.object({
  player_id: z.string(),
  username: z.string().min(1),
})

export type PlayerDTO = z.infer<typeof PlayerDTOSchema>

class PlayerService {
  readonly PLAYER_PREFIX = '/player'

  async getPlayer(playerID: string) {
    return baseTemplate
      .get<PlayerDTO>(this.PLAYER_PREFIX, {
        params: { playerID },
      })
      .then(data => PlayerDTOSchema.parse(data))
  }

  async createPlayer(username: string) {
    return baseTemplate
      .post<PlayerDTO>(this.PLAYER_PREFIX, { username })
      .then(data => PlayerDTOSchema.parse(data))
  }

  async updatePlayer(user: PlayerDTO) {
    const { player_id, username } = user
    return baseTemplate
      .put<PlayerDTO>(`${this.PLAYER_PREFIX}/${player_id}`, { username })
      .then(data => PlayerDTOSchema.parse(data))
  }

  async deletePlayer(playerID: string) {
    return baseTemplate.post<null>(`${this.PLAYER_PREFIX}/${playerID}`, null)
  }
}

export default new PlayerService()
