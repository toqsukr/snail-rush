import { baseConfig } from '@modules/app/api'
import { HTTP_HOST_URL } from '@modules/app/constant'
import axios from 'axios'
import { CreateSessionResponse, GetSessionResponse } from './type'

class SessionService {
  readonly SESSION_PREFIX = `${HTTP_HOST_URL}/api/v1/session`

  async getSession(sessionID: string) {
    return await axios.get<GetSessionResponse>(this.SESSION_PREFIX, {
      params: { sessionID },
    })
  }

  async createSession(playerID: string) {
    return await axios.post<CreateSessionResponse>(
      `${this.SESSION_PREFIX}/${playerID}`,
      null,
      baseConfig
    )
  }

  async deleteSession(sessionID: string) {
    return await axios.post<null>(`${this.SESSION_PREFIX}/${sessionID}`, null, baseConfig)
  }

  async connectSession(sessionID: string, playerID: string) {
    return await axios.post(
      `${this.SESSION_PREFIX}/${sessionID}/connect/${playerID}`,
      null,
      baseConfig
    )
  }

  async kickPlayer(sessionID: string, playerID: string) {
    return await axios.post(
      `${this.SESSION_PREFIX}/${sessionID}/kick/${playerID}`,
      null,
      baseConfig
    )
  }
}

export default new SessionService()
