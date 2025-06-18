import { getRawTokenFromStorage, removeTokenEverywhere } from '@shared/config/token'
import axios from 'axios'
import baseTemplate from './base-template'

const authTemplate = axios.create({
  ...baseTemplate.defaults,
  baseURL: baseTemplate.defaults.baseURL,
  headers: { ...baseTemplate.defaults.headers },
})

authTemplate.interceptors.request.use(request => {
  const token = getRawTokenFromStorage()
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

authTemplate.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      removeTokenEverywhere()
    }
    return Promise.reject(error)
  }
)

export default authTemplate
