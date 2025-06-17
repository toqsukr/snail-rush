import { z } from 'zod'
import authTemplate from './auth-template'
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

export type RegisterDTO = z.infer<typeof RegisterResponseSchema>

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

  async getUserByToken() {
    return authTemplate
      .get(`${this.AUTH_PREFIX}/me/`)
      .then(({ data }) => PlayerDTOSchema.parse(data))
  }
}

export default new AuthService()
