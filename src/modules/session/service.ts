import { baseConfig } from '@modules/app/api'
import { HTTP_HOST_URL } from '@modules/app/constant'
import axios from 'axios'
import { ConnectPlayerResponse, CreateSessionResponse, GetSessionResponse } from './type'

class SessionService {
  readonly SESSION_PREFIX = `${HTTP_HOST_URL}/api/v1/session`

  async getSession(sessionID: string) {
    return await axios.get<GetSessionResponse>(this.SESSION_PREFIX, {
      params: { sessionID },
    })
  }

  async createSession(playerID: string) {
    return await axios.post<CreateSessionResponse>(
      `${this.SESSION_PREFIX}`,
      { player_id: playerID },
      baseConfig
    )
  }

  async deleteSession(sessionID: string) {
    return await axios.delete(`${this.SESSION_PREFIX}/${sessionID}`, baseConfig)
  }

  async connectSession(sessionID: string, playerID: string) {
    return await axios.post<ConnectPlayerResponse>(
      `${this.SESSION_PREFIX}/${sessionID}/connect/${playerID}`,
      null,
      baseConfig
    )
  }

  async kickPlayer(sessionID: string, actionID: string, dependentID: string) {
    return await axios.delete(`${this.SESSION_PREFIX}/${sessionID}/player/${actionID}/kick/${dependentID}`, baseConfig)
  }
}

export default new SessionService()
