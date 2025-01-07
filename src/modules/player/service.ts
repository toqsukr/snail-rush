import { baseConfig } from '@modules/app/api'
import { HTTP_HOST_URL } from '@modules/app/constant'
import axios from 'axios'
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  GetPlayerResponse,
  UpdatePlayerRequest,
  UpdatePlayerResponse,
} from './type'

class PlayerService {
  readonly PLAYER_PREFIX = `${HTTP_HOST_URL}/api/v1/player`

  async getPlayer(playerID: string) {
    return await axios.get<GetPlayerResponse>(this.PLAYER_PREFIX, {
      params: { playerID },
    })
  }

  async createPlayer(data: CreatePlayerRequest) {
    return await axios.post<CreatePlayerResponse>(this.PLAYER_PREFIX, data, baseConfig)
  }

  async updatePlayer(playerID: string, data: UpdatePlayerRequest) {
    return await axios.put<UpdatePlayerResponse>(
      `${this.PLAYER_PREFIX}/${playerID}`,
      data,
      baseConfig
    )
  }

  async deletePlayer(playerID: string) {
    return await axios.post<null>(`${this.PLAYER_PREFIX}/${playerID}`, null, baseConfig)
  }
}

export default new PlayerService()
