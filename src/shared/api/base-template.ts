import axios from 'axios'

export const HTTP_HOST_URL = import.meta.env.VITE_HTTP_HOST_URL ?? 'http://localhost:10000'
export const WS_HOST_URL = import.meta.env.VITE_WS_HOST_URL ?? 'ws://localhost:10000'

const baseTemplate = axios.create({
  baseURL: `${HTTP_HOST_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default baseTemplate
