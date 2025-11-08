import axios from 'axios'

const CLIENT_IP = import.meta.env.VITE_CLIENT_IP ?? 'localhost'
const CLIENT_PORT = import.meta.env.VITE_CLIENT_PORT ?? '4173'

export const HTTP_HOST_URL = `https://${CLIENT_IP}:${CLIENT_PORT}`
export const WS_HOST_URL = `wss://${CLIENT_IP}:${CLIENT_PORT}`

const baseTemplate = axios.create({
  baseURL: `${HTTP_HOST_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default baseTemplate
