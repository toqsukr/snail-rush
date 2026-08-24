import { AxiosError } from 'axios'
import i18next from 'i18next'
import { pushToast } from '@shared/lib/toast'

const textOf = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

export const serverMessage = (error: AxiosError): string | null => {
  const data = error.response?.data
  if (typeof data === 'string') return textOf(data)
  const body = (data ?? {}) as Record<string, unknown>
  return textOf(body.detail) ?? textOf(body.message) ?? textOf(body.error)
}

const fallbackMessage = (error: AxiosError): string => {
  const status = error.response?.status
  if (status) return i18next.t('request_error_text', { status })
  return i18next.t('network_error_text')
}

export const notifyError = (error: AxiosError) => {
  pushToast(serverMessage(error) ?? fallbackMessage(error))
  return Promise.reject(error)
}
