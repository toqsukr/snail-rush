import { z } from 'zod'
import baseTemplate from './base-template'
import { PlayerDTOSchema } from './player'

export const SessionDTOSchema = z.object({
  session_id: z.string(),
  players: PlayerDTOSchema.array(),
  is_active: z.boolean(),
  host_id: z.string(),
  score: z.record(z.number()),
})

export type SessionDTO = z.infer<typeof SessionDTOSchema>

class SessionService {
  readonly SESSION_PREFIX = `/session`

  async getSession(session_id: string) {
    return baseTemplate
      .get(`${this.SESSION_PREFIX}/${session_id}/`)
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async createSession(player_id: string) {
    return baseTemplate
      .post(`${this.SESSION_PREFIX}/`, { player_id })
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async deleteSession(session_id: string) {
    return baseTemplate.delete(`${this.SESSION_PREFIX}/${session_id}/`)
  }

  async connectSession(session_id: string, player_id: string) {
    return baseTemplate
      .post(`${this.SESSION_PREFIX}/${session_id}/connect/${player_id}/`, null)
      .then(({ data }) => SessionDTOSchema.parse(data))
  }

  async kickPlayer(session_id: string, action_id: string, dependent_id: string) {
    return baseTemplate.delete(
      `${this.SESSION_PREFIX}/${session_id}/player/${action_id}/kick/${dependent_id}/`
    )
  }

  async toggleReady(session_id: string, player_id: string) {
    return baseTemplate.post(
      `${this.SESSION_PREFIX}/${session_id}/player/${player_id}/toggle-ready/`,
      null
    )
  }
}

export default new SessionService()
