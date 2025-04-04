import axios, { AxiosResponse } from 'axios'

export const HTTP_HOST_URL = 'http://localhost:10000'
// 'https://213.171.31.233:10000'
export const WS_HOST_URL = 'ws://localhost:10000'

const baseTemplate = axios.create({
  baseURL: `${HTTP_HOST_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

baseTemplate.interceptors.response.use((response: AxiosResponse) => {
  return response
})

export default baseTemplate
