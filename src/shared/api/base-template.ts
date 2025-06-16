import axios, { AxiosResponse } from 'axios'

export const HTTP_HOST_URL = 'https://snails.pakulove.ru:10000'
export const WS_HOST_URL = 'wss://snails.pakulove.ru:10000'
// 'https://snails.pakulove.ru'

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
