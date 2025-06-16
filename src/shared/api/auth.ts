import { z } from 'zod'
import baseTemplate from './base-template'
import { PlayerDTOSchema } from './player'

const TokenDTOSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
})

const RegisterResponseSchema = z.object({
  player: PlayerDTOSchema,
  token: TokenDTOSchema,
})

class AuthService {
  readonly AUTH_PREFIX = '/auth'

  async register(data: { username: string; password: string; skin_id?: string }) {
    return baseTemplate
      .post(`${this.AUTH_PREFIX}/register/`, data)
      .then(({ data }) => RegisterResponseSchema.parse(data))
  }

  async login(data: { username: string; password: string }) {
    return baseTemplate
      .post(`${this.AUTH_PREFIX}/token/`, data)
      .then(({ data }) => TokenDTOSchema.parse(data))
  }

  async getPlayerByToken() {
    const token = localStorage.getItem('player-token')
    return baseTemplate
      .get(`${this.AUTH_PREFIX}/me/`, {
        headers: {
          ...baseTemplate.defaults.headers.common,
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => PlayerDTOSchema.parse(data))
  }
}

export default new AuthService()
