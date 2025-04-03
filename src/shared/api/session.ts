import { z } from 'zod'
import baseTemplate from './base-template'
import { PlayerDTOSchema } from './player'

export const SessionDTOSchema = z.object({
  session_id: z.string(),
  players: PlayerDTOSchema.array(),
  is_active: z.boolean(),
  host_id: z.string(),
})

export type SessionDTO = z.infer<typeof SessionDTOSchema>

class SessionService {
  readonly SESSION_PREFIX = `/session`

  async getSession(sessionID: string) {
    return baseTemplate
      .get<SessionDTO>(this.SESSION_PREFIX, {
        params: { sessionID },
      })
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async createSession(playerID: string) {
    return baseTemplate
      .post<SessionDTO>(`${this.SESSION_PREFIX}`, {
        player_id: playerID,
      })
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async deleteSession(sessionID: string) {
    return baseTemplate.delete(`${this.SESSION_PREFIX}/${sessionID}`)
  }

  async connectSession(sessionID: string, playerID: string) {
    return baseTemplate
      .post<SessionDTO>(`${this.SESSION_PREFIX}/${sessionID}/connect/${playerID}`, null)
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async kickPlayer(sessionID: string, actionID: string, dependentID: string) {
    return baseTemplate.delete(
      `${this.SESSION_PREFIX}/${sessionID}/player/${actionID}/kick/${dependentID}`
    )
  }
}

export default new SessionService()
