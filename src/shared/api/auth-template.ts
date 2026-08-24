import { getRawTokenFromStorage, removeTokenEverywhere } from '@shared/config/token'
import axios from 'axios'
import baseTemplate from './base-template'
import { notifyError } from './error-toast'

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
    return notifyError(error)
  }
)

export default authTemplate
